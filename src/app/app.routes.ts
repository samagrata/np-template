import { Routes } from '@angular/router';

import { Home } from './home/home';
import { StoryPage } from './story-page/story-page';
import { About } from './about/about';
import { Awards } from './awards/awards';
import { Donation } from './donation/donation';
import { Works } from './works/works';
import { Volunteers } from './volunteers/volunteers';
import { Reports } from './reports/reports';
import { Faq } from './faq/faq';
import { Events } from './events/events';
import { Affiliations } from './affiliations/affiliations';
import { AdminLogin } from './admin/login/login';
import { AdminDashboard } from './admin/dashboard/dashboard';
import { Visualizations } from './admin/dashboard/visualizations/visualizations';
import { CaseRegistry } from './admin/dashboard/case-registry/case-registry';
import { ResourceManagement } from './admin/dashboard/resource-management/resource-management';
import { VolunteerApplications } from './admin/dashboard/volunteer-applications/volunteer-applications';
import { StoryManagement } from './admin/dashboard/story-management/story-management';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		title: 'Home',
		component: Home,
	},
	{
		path: 'story/:id',
		title: 'Story',
		component: StoryPage,
	},
	{
		path: 'about',
		title: 'About Us',
		component: About,
	},
	{
		path: 'awards',
		title: 'Awards & Recognitions',
		component: Awards,
	},
	{
		path: 'donate',
		title: 'Donate to Us',
		component: Donation,
	},
	{
		path: 'works',
		title: 'Our Works',
		component: Works,
	},
	{
		path: 'events',
		title: 'Event Calendar',
		component: Events,
	},
	{
		path: 'volunteer',
		title: 'Get Involved',
		component: Volunteers,
	},
	{
		path: 'reports',
		title: 'Impact Reports',
		component: Reports,
	},
	{
		path: 'affiliations',
		title: 'Affiliations',
		component: Affiliations,
	},
	{
		path: 'faqs',
		title: 'FAQs',
		component: Faq,
	},
	{
		path: 'admin/login',
		title: 'Admin Login',
		component: AdminLogin,
	},
	{
		path: 'admin/dashboard',
		title: 'Admin Dashboard',
		component: AdminDashboard,
    canActivate: [AuthGuard],
		
		children: [
			{
				path: '',
				redirectTo: 'visualizations',
        pathMatch: 'full'
			},
			{
				path: 'visualizations',
				component: Visualizations
			},
			{
				path: 'case-registry',
				component: CaseRegistry
			},
			{
				path: 'resource-management',
				component: ResourceManagement
			},
			{
				path: 'story-management',
				component: StoryManagement
			},
			{
				path: 'volunteer-applications',
				component: VolunteerApplications
			}
		]
	}
];
