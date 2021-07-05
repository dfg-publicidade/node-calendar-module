import App from '@dfgpublicidade/node-app-module';
declare class Calendar {
    static readonly services: any;
    static generate(app: App, params: {
        start: Date;
        end: Date;
        title: string;
        description?: string;
        location?: string;
    }): any;
}
export default Calendar;
