"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiRepository = void 0;
const inversify_1 = require("inversify");
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("../utils/logger"));
let PublicApiRepository = class PublicApiRepository {
    fetchGitHub(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://github-contributions-api.jogruber.de/v4/${username}`;
                const response = yield (0, node_fetch_1.default)(url);
                const json = (yield response.json());
                // Fixed: Proper type checking
                return Array.isArray(json === null || json === void 0 ? void 0 : json.contributions) ? json.contributions : [];
            }
            catch (error) {
                logger_1.default.error('GitHub fetch failed:', error);
                return [];
            }
        });
    }
    fetchLeetCodeStats(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
            try {
                const response = yield (0, node_fetch_1.default)('https://leetcode.com/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { username } }),
                });
                const json = (yield response.json());
                const stats = (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.data) === null || _a === void 0 ? void 0 : _a.matchedUser) === null || _b === void 0 ? void 0 : _b.submitStats) === null || _c === void 0 ? void 0 : _c.acSubmissionNum;
                if (!Array.isArray(stats)) {
                    return { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
                }
                const map = { All: 0, Easy: 0, Medium: 0, Hard: 0 };
                stats.forEach((item) => {
                    map[item.difficulty] = item.count;
                    if (item.difficulty !== 'All')
                        map.All += item.count;
                });
                return {
                    totalSolved: map.All,
                    easySolved: map.Easy,
                    mediumSolved: map.Medium,
                    hardSolved: map.Hard,
                };
            }
            catch (error) {
                logger_1.default.error('LeetCode stats fetch failed:', error);
                return { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
            }
        });
    }
    // Fixed signature to match interface
    fetchAll(leetcodeUsername, githubUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const [github, leetcode] = yield Promise.all([
                this.fetchGitHub(githubUsername),
                this.fetchLeetCodeStats(leetcodeUsername),
            ]);
            return { github, leetcode };
        });
    }
};
exports.PublicApiRepository = PublicApiRepository;
exports.PublicApiRepository = PublicApiRepository = __decorate([
    (0, inversify_1.injectable)()
], PublicApiRepository);
