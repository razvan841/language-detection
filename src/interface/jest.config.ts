import type { Config } from "@jest/types";

process.env.JWT_SECRET_KEY = "VERYSECRETKEY";

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
		"^@/(.*)$": "<rootDir>/$1",
	},
	extensionsToTreatAsEsm: [".ts"],
	transform: {
		"^.+\\.(mt|t|cj|j)s$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
};
export default config;
