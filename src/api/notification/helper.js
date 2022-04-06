import { v4 as uuidv4 } from 'uuid'
import { getCard } from '../../ui/molecules/notification.cards/notification.cards.core'
export class NotificationHelper {
    static ADD = "ADD"
    static REMOVE = "REMOVE"
    static REMOVE_ALL = "REMOVE_ALL"
    
    constructor ( state, dispatch ) {
        this.dispatch = dispatch
        this.state = state
    }

    
    createCard(timeout=null, type=null, data) {
        var id = uuidv4()
        this.dispatch({ type: "ADD", payload: {
            id: id,
            type: type,
            timeout: timeout,
            content: getCard,
            callback: () => this._timeout(id, timeout),
            close: () => this._close(id),
            ...data,
        }})
    }

    //callbacks

    _close(id) {
        this.dispatch({type: "REMOVE", payload: { id: id }})
    }

    _timeout(id, timeout) {
        setTimeout(() => {
            this.dispatch({ type: "REMOVE", payload: { id: id }})
        }, timeout)
    }

    

}