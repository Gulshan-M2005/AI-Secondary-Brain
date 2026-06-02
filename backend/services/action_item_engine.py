import re


def normalize_items(items) -> list[dict]:
    normalized = []
    for item in items or []:
        if isinstance(item, str):
            normalized.append({"task": item, "assignee": "", "deadline": "", "notes": ""})
        elif isinstance(item, dict):
            normalized.append(
                {
                    "task": str(item.get("task") or item.get("item") or ""),
                    "assignee": str(item.get("assignee") or ""),
                    "deadline": str(item.get("deadline") or ""),
                    "notes": str(item.get("notes") or ""),
                }
            )
    return [item for item in normalized if item["task"]]


def heuristic_action_items(text: str) -> list[dict]:
    patterns = ["todo", "action", "follow up", "deadline", "next step", "will do", "need to"]
    items = []
    for sentence in re.split(r"(?<=[.!?])\s+", text):
        if any(pattern in sentence.lower() for pattern in patterns):
            items.append({"task": sentence.strip(), "assignee": "", "deadline": "", "notes": "Detected locally"})
    return items[:20]
