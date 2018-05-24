export class CommandButton {
    // Add Pizza=AddProduct:Product=Pizza,Price=10
    public command: string;
    public caption: string;
    public parameters: any;
    public color: string;

    constructor(payload: string, color: string = 'primary') {
        this.command = payload;
        this.caption = payload;
        this.color = color;
        if (payload.includes(':')) {
            const parts = payload.split(':');
            payload = parts[0];
            this.parameters = parts[1].split(',').reduce(
                (r, p) => {
                    const params = p.split('=');
                    r[params[0]] = params[1];
                    return r;
                },
                {});
        }
        if (payload.includes('=')) {
            const parts = payload.split('=');
            this.caption = parts[0];
            this.command = parts[1];
        }
    }
}