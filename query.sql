SELECT
    "Record id",
    "Target: Policy expertise",
    "Generated: policy experience AI prediction",
    ABS("Target: Policy expertise" - "Generated: policy experience AI prediction") as diff,
    "Generated: policy experience AI transcript"
FROM application ORDER BY diff DESC