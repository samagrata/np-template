import { Subject } from "../../../../shared/interfaces/Subject";

export interface Case {
	id: number;
	caseNumber: string;
	openingDate: string;
  closingDate: string;
  noOfRs: number;
  tHours: number;
  subject: Subject;
}