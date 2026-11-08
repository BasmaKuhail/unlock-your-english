import assert from "node:assert/strict";
import test from "node:test";
import { getSectionStates } from "../lib/learner/progression.ts";

const sections = ["first", "second", "third"].map((id) => ({ id, isOpen: true }));

test("only the first section is available to a new learner", () => {
  assert.deepEqual(getSectionStates(sections, [], true), ["available", "locked", "locked"]);
});

test("completion unlocks the next section and preserves review access", () => {
  assert.deepEqual(getSectionStates(sections, ["first"], true), ["completed", "available", "locked"]);
  assert.deepEqual(getSectionStates(sections, ["first", "second", "third"], true), ["completed", "completed", "completed"]);
});

test("closed sections cannot be skipped", () => {
  const closed = sections.map((section, index) => ({ ...section, isOpen: index !== 1 }));
  assert.deepEqual(getSectionStates(closed, ["first"], true), ["completed", "locked", "locked"]);
});

test("admin level restrictions override saved completion", () => {
  assert.deepEqual(getSectionStates(sections, ["first", "second"], false), ["locked", "locked", "locked"]);
});

test("removed section IDs do not unlock unrelated sections", () => {
  assert.deepEqual(getSectionStates(sections, ["removed-section"], true), ["available", "locked", "locked"]);
  assert.deepEqual(getSectionStates([], [], true), []);
});
