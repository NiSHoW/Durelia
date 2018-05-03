import { singleton, inject, observe, computedFrom } from "durelia-framework";
import * as durandalRouter from "plugins/router";
import * as durandalApp from "durandal/app";
import { IViewModel } from "durelia-viewmodel";

@observe(true)
@singleton
@inject(durandalRouter)
export default class Shell implements IViewModel<void> {

    constructor(
        public router: DurandalRootRouter
    ) {}

    @computedFrom("durandalApp.title")
    get heading(): string {
        return `${durandalApp.title} - ${this.router.activeInstruction().config.title}`;
    }

    activate(): Promise<any> {
        return this.configureRouter();
    }

    deactivate(): Promise<any> {
        return Promise.resolve();
    }

    configureRouter(): Promise<any> {

        this.router.map([
            { name: "Home", route: "", title: "Home", moduleId: "views/home/home", nav: true },
            { name: "Notes", route: "notes", title: "Notes", moduleId: "views/notes/notelist", nav: true },
            { name: "NoteDetail", route: "notes/:id", title: "Note detail", moduleId: "views/notes/notedetail", nav: false }
        ]).buildNavigationModel();

        return this.router.activate() as any;
    }
}
