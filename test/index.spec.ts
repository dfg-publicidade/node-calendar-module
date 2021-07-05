import App, { AppInfo } from '@dfgpublicidade/node-app-module';
import Dates from '@dfgpublicidade/node-dates-module';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import moment from 'moment-timezone';
import Calendar from '../src';

/* Tests */
describe('index.ts', (): void => {
    let app: App;
    let app2: App;

    before(async (): Promise<void> => {
        const appInfo: AppInfo = {
            name: 'test',
            version: 'v1'
        };

        app = new App({
            appInfo,
            config: {}
        });

        app2 = new App({
            appInfo,
            config: {
                calendar: {
                    ics: {
                        url: 'https://ics.com.br',
                        title: 'title',
                        start: 'start',
                        end: 'end',
                        description: 'description',
                        location: 'location',
                        format: 'DD/MM/YYYY HH:mm'
                    }
                }
            }
        });
    });

    it('1. generate', async (): Promise<void> => {
        const params: any = {};

        const calendar: any = Calendar.generate(app, params);

        expect(calendar).to.be.undefined;
    });

    it('2. generate', async (): Promise<void> => {
        const params: any = {
            start: Dates.toDateTime('01/01/2021 10:00'),
            end: Dates.toDateTime('01/01/2021 11:00'),
            title: 'Test'
        };

        const calendar: any = Calendar.generate(app, params);

        expect(calendar).to.exist;
        expect(calendar).to.have.property('office365');
        expect(calendar).to.have.property('outlook');
        expect(calendar).to.have.property('google');

        const office365: URL = new URL(calendar.office365);

        expect(office365).to.exist;
        expect(office365.searchParams.get('rru')).eq('addevent');
        expect(office365.searchParams.get('subject')).eq(params.title);
        expect(office365.searchParams.get('startdt')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.office365.format));
        expect(office365.searchParams.get('enddt')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.office365.format));
        expect(office365.searchParams.get('body')).null;
        expect(office365.searchParams.get('location')).null;

        const outlook: URL = new URL(calendar.outlook);

        expect(outlook).to.exist;
        expect(outlook.searchParams.get('rru')).eq('addevent');
        expect(outlook.searchParams.get('subject')).eq(params.title);
        expect(outlook.searchParams.get('startdt')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.outlook.format));
        expect(outlook.searchParams.get('enddt')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.outlook.format));
        expect(outlook.searchParams.get('body')).null;
        expect(outlook.searchParams.get('location')).null;

        const google: URL = new URL(calendar.google);

        expect(google).to.exist;
        expect(google.searchParams.get('action')).eq('TEMPLATE');
        expect(google.searchParams.get('text')).eq(params.title);
        expect(google.searchParams.get('dates')).eq(
            moment(params.start).tz(process.env.TZ).format(Calendar.services.google.format)
            + '/'
            + moment(params.end).tz(process.env.TZ).format(Calendar.services.google.format)
        );
        expect(google.searchParams.get('details')).null;
        expect(google.searchParams.get('location')).null;

        expect(calendar.ics).to.be.undefined;
    });

    it('3. generate', async (): Promise<void> => {
        const params: any = {
            start: Dates.toDateTime('01/01/2021 10:00'),
            end: Dates.toDateTime('01/01/2021 11:00'),
            title: 'Test',
            description: 'Test event',
            location: 'Test location'
        };

        const calendar: any = Calendar.generate(app, params);

        expect(calendar).to.exist;
        expect(calendar).to.have.property('office365');
        expect(calendar).to.have.property('outlook');
        expect(calendar).to.have.property('google');

        const office365: URL = new URL(calendar.office365);

        expect(office365).to.exist;
        expect(office365.searchParams.get('rru')).eq('addevent');
        expect(office365.searchParams.get('subject')).eq(params.title);
        expect(office365.searchParams.get('startdt')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.office365.format));
        expect(office365.searchParams.get('enddt')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.office365.format));
        expect(office365.searchParams.get('body')).eq(params.description);
        expect(office365.searchParams.get('location')).eq(params.location);

        const outlook: URL = new URL(calendar.outlook);

        expect(outlook).to.exist;
        expect(outlook.searchParams.get('rru')).eq('addevent');
        expect(outlook.searchParams.get('subject')).eq(params.title);
        expect(outlook.searchParams.get('startdt')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.outlook.format));
        expect(outlook.searchParams.get('enddt')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.outlook.format));
        expect(outlook.searchParams.get('body')).eq(params.description);
        expect(outlook.searchParams.get('location')).eq(params.location);

        const google: URL = new URL(calendar.google);

        expect(google).to.exist;
        expect(google.searchParams.get('action')).eq('TEMPLATE');
        expect(google.searchParams.get('text')).eq(params.title);
        expect(google.searchParams.get('dates')).eq(
            moment(params.start).tz(process.env.TZ).format(Calendar.services.google.format)
            + '/'
            + moment(params.end).tz(process.env.TZ).format(Calendar.services.google.format)
        );
        expect(google.searchParams.get('details')).eq(params.description);
        expect(google.searchParams.get('location')).eq(params.location);

        expect(calendar.ics).to.be.undefined;
    });

    it('4. generate', async (): Promise<void> => {
        const params: any = {
            start: Dates.toDateTime('01/01/2021 10:00'),
            end: Dates.toDateTime('01/01/2021 11:00'),
            title: 'Test',
            description: 'Test event',
            location: 'Test location'
        };

        const calendar: any = Calendar.generate(app2, params);

        expect(calendar).to.exist;
        expect(calendar).to.have.property('office365');
        expect(calendar).to.have.property('outlook');
        expect(calendar).to.have.property('google');

        const office365: URL = new URL(calendar.office365);

        expect(office365).to.exist;
        expect(office365.searchParams.get('rru')).eq('addevent');
        expect(office365.searchParams.get('subject')).eq(params.title);
        expect(office365.searchParams.get('startdt')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.office365.format));
        expect(office365.searchParams.get('enddt')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.office365.format));
        expect(office365.searchParams.get('body')).eq(params.description);
        expect(office365.searchParams.get('location')).eq(params.location);

        const outlook: URL = new URL(calendar.outlook);

        expect(outlook).to.exist;
        expect(outlook.searchParams.get('rru')).eq('addevent');
        expect(outlook.searchParams.get('subject')).eq(params.title);
        expect(outlook.searchParams.get('startdt')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.outlook.format));
        expect(outlook.searchParams.get('enddt')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.outlook.format));
        expect(office365.searchParams.get('body')).eq(params.description);
        expect(office365.searchParams.get('location')).eq(params.location);

        const google: URL = new URL(calendar.google);

        expect(google).to.exist;
        expect(google.searchParams.get('action')).eq('TEMPLATE');
        expect(google.searchParams.get('text')).eq(params.title);
        expect(google.searchParams.get('dates')).eq(
            moment(params.start).tz(process.env.TZ).format(Calendar.services.google.format)
            + '/'
            + moment(params.end).tz(process.env.TZ).format(Calendar.services.google.format)
        );
        expect(google.searchParams.get('details')).eq(params.description);
        expect(google.searchParams.get('location')).eq(params.location);

        const ics: URL = new URL(calendar.ics);

        expect(ics).to.exist;
        expect(ics.searchParams.get('title')).eq(params.title);
        expect(ics.searchParams.get('start')).eq(moment(params.start).tz(process.env.TZ).format(Calendar.services.ics.format));
        expect(ics.searchParams.get('end')).eq(moment(params.end).tz(process.env.TZ).format(Calendar.services.ics.format));
        expect(ics.searchParams.get('description')).eq(params.description);
        expect(ics.searchParams.get('location')).eq(params.location);
    });
});
