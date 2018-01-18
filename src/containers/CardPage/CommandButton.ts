export class CommandButton {
    // Add Pizza=AddProduct:Product=Pizza,Price=10
    command: string;
    caption: string;
    parameters: any;

    constructor(payload: string) {
        this.command = payload;
        this.caption = payload;
        if (payload.includes(':')) {
            let parts = payload.split(':');
            payload = parts[0];
            this.parameters = parts[1].split(',').reduce(
                (r, p) => {
                    let params = p.split('=');
                    r[params[0]] = params[1];
                    return r;
                },
                {});
        }
        if (payload.includes('=')) {
            let parts = payload.split('=');
            this.caption = parts[0];
            this.command = parts[1];
        }
    }
}