export interface Story {
	id: number;
  caseNumber: string;
	title: string;
	paragraphs: string[];
	carouselImages: string[];
	carousels: CarouselItem[];
	fundGoal: string;
	fundsReceived: Donation[];
	fundsUsed: Expense[];
	comments: Comment[];
	publish: boolean;
	publishDate: string;
	ssFile: string | ArrayBuffer | null;
}

export interface Comment {
  id: number;
	email: string;
	name: string;
	text: string;
	createdAt: string;
	approved: boolean;
}

export interface CarouselItem {
	title: string;
	text: string;
	img: string;
}

export interface Donation {
  id: number;
	date: string;
	referenceNumber: string;
	remark: string;
	amount: string;
}

export interface Expense {
  id: number;
	name: string;
	amount: string;
}
