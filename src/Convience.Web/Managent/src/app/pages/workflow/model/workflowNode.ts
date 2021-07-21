export class WorkflowNode {

    id?:number;

    // StartNode = 0,
    // WorkNode = 1,
    // EndNode = 99,
    nodeType: number;

    domId: string;
    name: string;
    top: number;
    left: number;

    // Personnel = 1, // 指定人员處理
    // Position = 2, // 指定職位處理
    // Leader = 3, // 指定部門負责人處理
    // UserLeader = 4, // 指定發起人部門負责人處理
    // UpLeader = 5, // 指定發起人上级部門負责人處理
    handleMode: number;
    handlers: string; // 1
    position: string; // 2
    department: string; // 3
}
