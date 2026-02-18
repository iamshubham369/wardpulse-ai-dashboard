export const wardData = {
  wardName: "Ward 12 - Andheri East",
  representative: "Mr. Rajesh Patil",
  budgetAllocated: 50000000,
  budgetUsed: 32000000,

  projects: [
    {
      id: 1,
      name: "Road Repair Initiative",
      department: "Infrastructure",
      budgetAllocated: 15000000,
      budgetUsed: 12000000,
      progress: 75,
      status: "On Track",
      deadline: "2026-06-30",
      complaintsLinked: 5
    },
    {
      id: 2,
      name: "Drainage Modernization",
      department: "Public Works",
      budgetAllocated: 20000000,
      budgetUsed: 21000000,
      progress: 60,
      status: "Delayed",
      deadline: "2026-04-15",
      complaintsLinked: 12
    },
    {
      id: 3,
      name: "Streetlight Upgrade",
      department: "Energy",
      budgetAllocated: 10000000,
      budgetUsed: 7000000,
      progress: 90,
      status: "On Track",
      deadline: "2026-02-20",
      complaintsLinked: 2
    }
  ],

  invoices: [
    {
      id: "INV-001",
      vendor: "ABC Constructions",
      amount: 2000000,
      date: "2026-01-10",
      purpose: "Material Procurement",
      project: "Road Repair Initiative"
    },
    {
      id: "INV-002",
      vendor: "Metro Pipes Ltd",
      amount: 3500000,
      date: "2026-01-22",
      purpose: "Drainage Pipes",
      project: "Drainage Modernization"
    }
  ]
};
