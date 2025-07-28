import { Subject } from "../../../../shared/interfaces/Subject";

export interface Resource {
  id: number;
  type: string;
  caseNumber: string;
  engagedSince: string;
  engagedUntil: string;
  hours: string;
  remark: string;
  subject: Subject;
}