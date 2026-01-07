interface GlobalStoreState {
    drawerChild: string | null
}

export const useGlobalStore = defineStore('global', {
    state: (): GlobalStoreState => ({
        drawerChild: null
    }),
    actions: {
        setDrawerChild(child: string | null) {
            this.drawerChild = child
        }
    }
})