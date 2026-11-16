import assert from "node:assert/strict";
import test from "node:test";
import { completedSectionFeedback } from "../lib/learner/progress-feedback.ts";

test("completion points the learner to the next available section", () => {
  const feedback = completedSectionFeedback({ sections: [{ state: "completed" }, { state: "available", title: "Next step" }] }, "Level one", "First step");
  assert.equal(feedback.kind, "success");
  assert.match(feedback.message, /Next step/);
});

test("a completed level gets its own celebration", () => {
  const feedback = completedSectionFeedback({ sections: [{ state: "completed" }] }, "Level one", "First step");
  assert.equal(feedback.kind, "level-complete");
  assert.match(feedback.message, /Level one/);
});

test("a locked or missing next section is not presented as available", () => {
  for (const level of [{ sections: [{ state: "completed" }, { state: "locked", title: "Locked" }] }, { sections: [] }, undefined]) {
    const feedback = completedSectionFeedback(level, "Level one", "First step");
    assert.equal(feedback.kind, "success");
    assert.doesNotMatch(feedback.message, /next section|Locked/);
  }
});
