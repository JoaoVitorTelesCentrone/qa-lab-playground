export type ExpenseStatus="pending"|"approved"|"rejected";export type Role="employee"|"manager"|"admin";
export type TestProfile={id:string;name:string;role:Role;teamId:string};
export type Expense={id:string;title:string;category:string;amount:number;date:string;status:ExpenseStatus;employeeName:string;employeeId:string;teamId:string;receiptFileName:string;description:string;createdAt:string;rejectionReason?:string};
export const categories=["Alimentação","Transporte","Hospedagem","Material de trabalho","Outros"];
export const profiles:TestProfile[]=[{id:"joao",name:"João Silva",role:"employee",teamId:"alpha"},{id:"marina",name:"Marina Costa",role:"manager",teamId:"alpha"},{id:"admin",name:"Admin Demo",role:"admin",teamId:"all"}];
export const expenseSeed:Expense[]=[
{id:"exp-1001",title:"Almoço com cliente",category:"Alimentação",amount:186.4,date:"2026-06-10",status:"pending",employeeName:"João Silva",employeeId:"joao",teamId:"alpha",receiptFileName:"almoco.pdf",description:"Reunião comercial",createdAt:"2026-06-10T14:00:00.000Z"},
{id:"exp-1002",title:"Táxi para aeroporto",category:"Transporte",amount:94.8,date:"2026-06-08",status:"approved",employeeName:"João Silva",employeeId:"joao",teamId:"alpha",receiptFileName:"taxi.jpg",description:"Viagem a trabalho",createdAt:"2026-06-08T18:00:00.000Z"},
{id:"exp-1003",title:"Hotel conferência",category:"Hospedagem",amount:780,date:"2026-05-28",status:"rejected",employeeName:"Carlos Lima",employeeId:"carlos",teamId:"alpha",receiptFileName:"hotel.pdf",description:"Hospedagem sem aprovação prévia",createdAt:"2026-05-28T10:00:00.000Z",rejectionReason:"Faltou aprovação prévia"},
{id:"exp-1004",title:"Licença de software",category:"Material de trabalho",amount:249.9,date:"2026-06-02",status:"approved",employeeName:"Beatriz Alves",employeeId:"bia",teamId:"alpha",receiptFileName:"licenca.pdf",description:"Ferramenta de prototipação",createdAt:"2026-06-02T09:30:00.000Z"},
{id:"exp-1005",title:"Jantar do time",category:"Alimentação",amount:420,date:"2026-06-12",status:"pending",employeeName:"Rafael Souza",employeeId:"rafael",teamId:"beta",receiptFileName:"jantar.png",description:"Confraternização",createdAt:"2026-06-12T22:00:00.000Z"},
];
export const expenseflowBugs={allowNegative:true,allowBlankTitle:true,employeeSelfApproval:true,rejectedFilterLeaks:true,approvedReportDelta:37.9,allowFutureDate:true,allowAnyReceipt:true}as const;
export const statusLabel:Record<ExpenseStatus,string>={pending:"Pendente",approved:"Aprovada",rejected:"Reprovada"};
