import App from '@dfgpublicidade/node-app-module';
import moment, { Moment } from 'moment-timezone';

/* Module */
class Calendar {
    public static readonly services: any = {
        office365: {
            url: 'https://outlook.office.com/calendar/0/deeplink/compose',
            params: '?rru=addevent'
                + '&subject={title}'
                + '&startdt={start}'
                + '&enddt={end}'
                + '&body={description}'
                + '&location={location}',
            format: 'YYYY-MM-DDTHH:mm:SSZ'
        },
        outlook: {
            url: 'https://outlook.live.com/calendar/0/deeplink/compose',
            params: '?rru=addevent'
                + '&subject={title}'
                + '&startdt={start}'
                + '&enddt={end}'
                + '&body={description}'
                + '&location={location}',
            format: 'YYYY-MM-DDTHH:mm:SSZ'
        },
        google: {
            url: 'https://calendar.google.com/calendar/render',
            params: '?action=TEMPLATE'
                + '&text={title}'
                + '&dates={start}/{end}'
                + '&details={description}'
                + '&location={location}',
            format: 'YYYYMMDDTHHmmSSZ'
        },
        ics: {
            params: '?{paramTitle}={title}'
                + '&{paramStart}={start}'
                + '&{paramEnd}={end}'
                + '&{paramDescription}={description}'
                + '&{paramLocation}={location}',
            format: '{paramFormat}'
        }
    };

    public static generate(app: App, params: {
        start: Date;
        end: Date;
        title: string;
        description?: string;
        location?: string;
    }): any {
        if (!params
            || !params.start
            || !params.end
            || !params.title
        ) {
            return undefined;
        }

        const startCal: Moment = moment(params.start).tz(process.env.TZ);
        const endCal: Moment = moment(params.end).tz(process.env.TZ);

        const json: any = {};

        const services: any = {
            ...this.services
        };

        for (const serviceName of Object.keys(services)) {
            const service: any = services[serviceName];

            let url: string = service.url + service.params;

            if (
                app.config.calendar
                && app.config.calendar[serviceName]
                && app.config.calendar[serviceName].url
                && app.config.calendar[serviceName].format
            ) {
                url = app.config.calendar[serviceName].url + service.params;
                url = url.replace(/{paramTitle}/ig, encodeURIComponent(app.config.calendar[serviceName].title));
                url = url.replace(/{paramStart}/ig, encodeURIComponent(app.config.calendar[serviceName].start));
                url = url.replace(/{paramEnd}/ig, encodeURIComponent(app.config.calendar[serviceName].end));
                url = url.replace(/{paramDescription}/ig, encodeURIComponent(app.config.calendar[serviceName].description));
                url = url.replace(/{paramLocation}/ig, encodeURIComponent(app.config.calendar[serviceName].location));

                service.format = app.config.calendar[serviceName].format;
            }
            else if (!service.url) {
                break;
            }

            url = url.replace(/\{start\}/ig, encodeURIComponent(startCal.format(service.format)));
            url = url.replace(/\{end\}/ig, encodeURIComponent(endCal.format(service.format)));
            url = url.replace(/\{title\}/ig, encodeURIComponent(params.title));

            url = params.description
                ? url.replace(/\{description\}/ig, encodeURIComponent(params.description))
                : url.replace(/&[a-zA-Z0-9]+=\{description\}/ig, '');

            url = params.location
                ? url.replace(/\{location\}/ig, encodeURIComponent(params.location))
                : url.replace(/&[a-zA-Z0-9]+=\{location\}/ig, '');

            json[serviceName] = url;
        }

        return json;
    }
}

export default Calendar;
