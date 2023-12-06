import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', ()=>{
    const memberName = ref('');
    const memberNum = ref(0);
    const memberAuth = ref(0);
    const memberRegdate = ref('');
    const memberPoint = ref(0);
    const memberAttend = ref(false);

    const setUserInfo = (name, num, auth, regdate) => {
        memberName.value = name;
        memberNum.value = num;
        memberAuth.value = auth;
        memberRegdate.value = regdate;
    }

    const setUserName = (name) => {
        memberName.value = name;
    }

    const setUserPoint = (point) => {
        memberPoint.value = point;
    }

    const setUserAttend = (attend) => {
        memberAttend.value = attend;
    }

    const getUserName = computed(()=>{
        return memberName.value;
    });

    const getUserNum = computed(() => {
        return memberNum.value;
    });

    const getUserAuth = computed(() => {
        return memberAuth.value;
    });

    const getUserRegdate = computed(() => {
        return memberRegdate.value;
    });

    const getUserPoint = computed(() => {
        return memberPoint.value;
    });

    const getUserAttend = computed(() => {
        return memberAttend.value;
    });

    function $reset(){
        memberName.value = '';
        memberNum.value = '';
        memberAuth.value = '';
        memberRegdate.value = '';
    }

    return { 
        setUserInfo, 
        setUserName,
        setUserPoint, 
        setUserAttend,
        getUserName, 
        getUserNum, 
        memberName, 
        memberNum, 
        memberAuth, 
        memberRegdate, 
        memberPoint,
        memberAttend,
        $reset, 
        getUserAuth, 
        getUserRegdate, 
        getUserPoint,
        getUserAttend,
    
    };
    
}, {persist: true});