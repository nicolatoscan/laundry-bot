import fs from 'fs';

export default class Session {
    private usernames: { [id: number]: string } = {}

    constructor() {
        if (fs.existsSync('./usernames.json')) {
            this.usernames = JSON.parse(fs.readFileSync('./usernames.json', 'utf8'));
        }
    }

    private save() {
        fs.writeFileSync('./usernames.json', JSON.stringify(this.usernames));
    }

    public addUsername(id: number, username: string) {
        this.usernames[id] = username;
        this.save();
    }

    public getUsername(id: number) {
        return this.usernames[id];
    }
}