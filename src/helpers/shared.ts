export class Helpers {

    date(date: Date, params?: Array<string>) {
        let getDate = new Date(date);
        if (!params) {
            return `${getDate.getDate()}/${getDate.getMonth() + 1}/${getDate.getFullYear()} - ${getDate.getHours()}:${getDate.getMinutes()}`
        }
    }

    public striptags(text: string): string {
        return text.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
    }
}
