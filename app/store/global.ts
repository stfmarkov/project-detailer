interface GlobalStoreState {
    drawerChild: string | null
    toast: {
        message: string
        type: 'success' | 'error' | 'warning' | 'info'
    } | null
}

export const useGlobalStore = defineStore('global', {
    state: (): GlobalStoreState => ({
        drawerChild: null,
        toast: null
    }),
    actions: {
        setDrawerChild(child: string | null) {
            this.drawerChild = child
        },

        setToast(message: string, type: 'success' | 'error' | 'warning' | 'info', timeout: number = 3000) {
            this.toast = {
                message,
                type,
            }

            setTimeout(() => {
                this.toast = null
            }, timeout)
        }
    }
})