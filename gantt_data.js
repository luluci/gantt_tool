window.__GANTT_DATA__ = {
  phases: ["all", "Design"],
  cases: [{ id: "case1", name: "Default" }],
  members: [
    { id: "mem1", name: "Alice", defaultColor: "#6b9bd2", holidays: [] },
  ],
  statuses: [
    { id: "st_open", name: "Open" },
    { id: "st_done", name: "Done" },
  ],
  commonHolidays: [],
  domains: [
    {
      id: "dom1",
      name: "Example domain",
      projects: [
        {
          id: "proj1",
          name: "Example project",
          versions: [
            {
              id: "ver1",
              name: "1.0",
              tasks: [
                {
                  id: "task1",
                  name: "Example task",
                  plans: [
                    {
                      id: "plan1",
                      name: "Example plan",
                      plannedStart: "2026-04-01",
                      plannedEnd: "2026-04-14",
                      actualStart: "",
                      actualEnd: "",
                      utilization: 1,
                      caseId: "case1",
                      ownerId: "mem1",
                      color: "#d17f6b",
                      statusId: "st_open",
                      phaseHours: {
                        all: { planned: 0, actual: 0 },
                        Design: { planned: 12, actual: 0 },
                      },
                      cells: {
                        "2026-04-08": {},
                        "2026-04-09": {},
                        "2026-04-10": {},
                        "2026-04-13": {},
                        "2026-04-14": {},
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
