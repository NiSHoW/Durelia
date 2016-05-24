import * as ko from "knockout";
import * as durandalObservable from "plugins/observable";
import {IDialogController} from "app-dialog";
import {computedRegistryKeyName} from "framework/viewmodeldecorators";

export interface IViewModel<TActivationOptions> {
    canActivate?(): Promise<boolean>;
    activate(options?: TActivationOptions): Promise<any>;
    canDeactivate?(): Promise<boolean>;
    deactivate(): Promise<any>;
}

export interface IModalViewModel<TActivationOptions, TDialogResult> extends IViewModel<TActivationOptions> {
}

export abstract class BaseViewModel<TActivationOptions> implements IViewModel<TActivationOptions> {
    
    constructor() {
        /* tslint:disable:forin */
        if (this[computedRegistryKeyName]) {
            for (let computedProp in this[computedRegistryKeyName]) {
                let computedDef: KnockoutComputedDefine<any> = this[computedRegistryKeyName][computedProp];
                computedDef.owner = this;
                durandalObservable.defineProperty<any>(this, computedProp, computedDef);
            }
            delete this[computedRegistryKeyName];
        }
        /* tslint:enable:forin */
    }
    
    canActivate(): Promise<boolean> {
        return Promise.resolve(true);
    }

    abstract activate(options: TActivationOptions): Promise<any>;
    
    canDeactivate(): Promise<boolean> {
        return Promise.resolve(true);
    }

    deactivate(): Promise<any> {
        this._disposables.forEach(d => d.dispose());
        return Promise.resolve();
    }
    
    private binding() {
        return { applyBindings: true, skipConversion: true };
    }
    
    private _disposables: IDisposable[] = [];
    
}

export abstract class BaseModalViewModel<TActivationModel, TResultOutput> 
    extends BaseViewModel<TActivationModel> 
    implements IModalViewModel<TActivationModel, TResultOutput> {

    constructor(
        private dialogController: IDialogController<TResultOutput>
    ) {
        super();
    }
    
    protected okResult(result: TResultOutput): void {
        this.dialogController.ok(result, this);
    }

    protected cancelResult(result: TResultOutput): void {
        this.dialogController.cancel(result, this);
    }

}