/*
 * Copyright 2024 Spring AI Community
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springaicommunity.claude.agent.sdk.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zeroturnaround.exec.ProcessExecutor;
import org.zeroturnaround.exec.ProcessResult;

import java.io.BufferedReader;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Utility for discovering Claude CLI executable location across different environments.
 *
 * <p>
 * This utility attempts to find the Claude CLI executable in common installation
 * locations and provides a fallback for development environments.
 * </p>
 */
public class ClaudeCliDiscovery {

	private static final Logger logger = LoggerFactory.getLogger(ClaudeCliDiscovery.class);

	private static final String FALLBACK_PATH = "/home/mark/.nvm/versions/node/v22.15.0/bin/claude";

	private static String discoveredPath;

	private static boolean discoveryAttempted = false;

	/**
	 * Discovers the Claude CLI executable path.
	 * @return the path to Claude CLI executable
	 * @throws ClaudeCliNotFoundException if Claude CLI cannot be found
	 */
	public static synchronized String discoverClaudePath() throws ClaudeCliNotFoundException {
		if (discoveryAttempted) {
			if (discoveredPath != null) {
				return discoveredPath;
			}
			else {
				throw new ClaudeCliNotFoundException("Claude CLI was not found during discovery");
			}
		}

		discoveryAttempted = true;

		// Check system property first
		String systemPropertyPath = System.getProperty("claude.cli.path");
		if (systemPropertyPath != null) {
			String resolvedPath = testAndResolveClaudeExecutable(systemPropertyPath);
			if (resolvedPath != null) {
				discoveredPath = resolvedPath;
				logger.info("Claude CLI found at system property: {}", resolvedPath);
				return discoveredPath;
			}
			else {
				// If system property is set but doesn't work, fail immediately
				throw new ClaudeCliNotFoundException(
						"Claude CLI specified in system property 'claude.cli.path' is not available: "
								+ systemPropertyPath);
			}
		}

		// Attempt discovery in order of preference
		String[] candidates = { "claude", // In PATH
				"claude-code", // Alternative name in PATH
				System.getProperty("user.home") + "/.local/bin/claude", // Local
																		// installation
				"/usr/local/bin/claude", // System-wide installation
				"/opt/claude/bin/claude", // Alternative system location
				System.getProperty("user.home") + "/.nvm/versions/node/v22.15.0/bin/claude", // NVM
																								// installation
				System.getProperty("user.home") + "/.nvm/versions/node/latest/bin/claude", // Latest
																							// NVM
				"/usr/bin/claude", // Standard system path
				FALLBACK_PATH // Development fallback
		};

		for (String candidate : candidates) {
			String resolvedPath = testAndResolveClaudeExecutable(candidate);
			if (resolvedPath != null) {
				discoveredPath = resolvedPath;
				logger.info("Claude CLI found at: {}", resolvedPath);
				return discoveredPath;
			}
		}

		// If discovery fails, provide detailed error message
		StringBuilder errorMessage = new StringBuilder();
		errorMessage.append("Claude CLI executable not found. Searched locations:\n");
		for (String candidate : candidates) {
			errorMessage.append("  - ").append(candidate).append("\n");
		}
		errorMessage.append("\nPlease ensure Claude CLI is installed and accessible.\n");
		errorMessage.append("Visit: https://github.com/anthropics/claude-code for installation instructions");

		throw new ClaudeCliNotFoundException(errorMessage.toString());
	}

	/**
	 * Tests if a Claude CLI executable exists and works at the given path. When the path
	 * is a command name (like "claude"), this resolves it to the full path.
	 * @param path command name or full path to test
	 * @return the resolved full path if the executable works, null if not found
	 */
	private static String testAndResolveClaudeExecutable(String path) {
		try {
			// For Windows, we may need to handle scripts differently
			String osName = System.getProperty("os.name").toLowerCase();
			List<String[]> commandsToTry = new ArrayList<>();

			if (osName.contains("win")) {
				// On Windows, try with explicit cmd execution for scripts
				if (isScriptOnWindows(path)) {
					commandsToTry.add(new String[]{"cmd", "/c", path, "--version"});
				} else {
					commandsToTry.add(new String[]{path, "--version"});
				}
			} else {
				commandsToTry.add(new String[]{path, "--version"});
			}

			// Also try with possible extensions on Windows if it's just a command name
			if (osName.contains("win") && !path.contains("/") && !path.contains("\\")) {
				commandsToTry.add(new String[]{"cmd", "/c", path + ".cmd", "--version"});
				commandsToTry.add(new String[]{"cmd", "/c", path + ".bat", "--version"});
				commandsToTry.add(new String[]{"cmd", "/c", path + ".ps1", "--version"});
			}

			// Also consider resolved path from 'where' command for Windows to ensure we test the actual file
			if (osName.contains("win") && !path.contains("/") && !path.contains("\\")) {
				String resolvedPath = resolveCommandPath(path);
				if (resolvedPath != null) {
					if (isScriptOnWindows(resolvedPath)) {
						commandsToTry.add(new String[]{"cmd", "/c", resolvedPath, "--version"});
					} else {
						commandsToTry.add(new String[]{resolvedPath, "--version"});
					}
				}
			}

			// Try each potential command combination
			for (String[] command : commandsToTry) {
				try {
					ProcessResult result = new ProcessExecutor().command(command)
						.timeout(5, TimeUnit.SECONDS)
						.readOutput(true)
						.execute();

					if (result.getExitValue() == 0) {
						String version = result.outputUTF8().trim();
						logger.debug("Found Claude CLI at {} with version: {}", String.join(" ", command), version);

						// Return the original path, not the execution command
						if (command.length >= 2 && !command[0].equals("cmd") && !command[1].equals("/c")) {
							return command[0];
						} else if (command.length >= 3 && command[0].equals("cmd") && command[1].equals("/c")) {
							// Extract the actual executable path from the cmd /c command
							String actualPath = command[2];
							// Strip extension if it was added for the test
							if (actualPath.endsWith(".cmd") || actualPath.endsWith(".bat") || actualPath.endsWith(".ps1")) {
								String basePath = actualPath.substring(0, actualPath.lastIndexOf('.'));
								if (new java.io.File(basePath).exists() && !basePath.equals(path)) {
									return basePath;
								}
							}
							return actualPath;
						}
					}
				} catch (Exception e) {
					logger.debug("Command failed: {} ({})", String.join(" ", command), e.getMessage());
					continue;
				}
			}
		}
		catch (Exception e) {
			logger.debug("Claude CLI not found at: {} ({})", path, e.getMessage());
		}
		return null;
	}

	/**
	 * Check if a given path looks like a script file on Windows which might need special handling
	 */
	private static boolean isScriptOnWindows(String path) {
		File file = new File(path);
		// If path exists and ends with script extensions, treat as script
		if (file.exists() && (
			path.toLowerCase().endsWith(".sh") ||
			path.toLowerCase().endsWith(".ps1") ||
			path.toLowerCase().endsWith(".cmd") ||
			path.toLowerCase().endsWith(".bat"))) {
			return true;
		}

		// If it's a file without extension and it looks like a POSIX script (has shebang)
		if (file.exists() && !file.isDirectory()) {
			try (java.io.BufferedReader br = new BufferedReader(java.nio.file.Files.newBufferedReader(file.toPath()))) {
				String firstLine = br.readLine();
				return firstLine != null && firstLine.startsWith("#!");
			} catch (Exception e) {
				// If we can't read the file to check for shebang, assume false
				return false;
			}
		}

		return false;
	}

	/**
	 * Resolves a command name to its full path using platform-appropriate commands. Uses
	 * 'which' on Unix/Linux/macOS and 'where' on Windows.
	 */
	private static String resolveCommandPath(String commandName) {
		try {
			String osName = System.getProperty("os.name").toLowerCase();
			String[] command;

			if (osName.contains("win")) {
				// Windows uses 'where'
				command = new String[] { "where", commandName };
			}
			else {
				// Unix/Linux/macOS use 'which'
				command = new String[] { "which", commandName };
			}

			ProcessResult result = new ProcessExecutor().command(command)
				.timeout(3, TimeUnit.SECONDS)
				.readOutput(true)
				.execute();

			if (result.getExitValue() == 0) {
				String output = result.outputUTF8().trim();
				// Windows 'where' can return multiple paths, take the first one
				if (osName.contains("win") && output.contains("\n")) {
					output = output.split("\n")[0].trim();
				}
				return output;
			}
		}
		catch (Exception e) {
			logger.debug("Failed to resolve command path for '{}': {}", commandName, e.getMessage());
		}
		return null;
	}

	/**
	 * Gets the discovered Claude CLI path without performing discovery. Used for cases
	 * where discovery has already been performed.
	 */
	public static String getDiscoveredPath() {
		return discoveredPath;
	}

	/**
	 * Checks if Claude CLI is available without throwing exceptions.
	 * @return true if Claude CLI is available, false otherwise
	 */
	public static boolean isClaudeCliAvailable() {
		try {
			discoverClaudePath();
			return true;
		}
		catch (ClaudeCliNotFoundException e) {
			return false;
		}
	}

	/**
	 * Forces re-discovery of Claude CLI path. Useful for testing or when installation
	 * state may have changed.
	 */
	public static synchronized void forceRediscovery() {
		discoveryAttempted = false;
		discoveredPath = null;
	}

	/**
	 * Exception thrown when Claude CLI cannot be discovered.
	 */
	public static class ClaudeCliNotFoundException extends Exception {

		public ClaudeCliNotFoundException(String message) {
			super(message);
		}

	}

}