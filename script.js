const { createApp, ref } = Vue;

const app = createApp({
    setup() {
        const selectedBadge = ref('./images/0碳4月计划32.1KM.png');
        const badges = ref([
            './images/0碳4月计划10KM.png',
            './images/0碳4月计划15KM.png',
            './images/0碳4月计划32.1KM.png'
        ]);
        const nickname = ref('哈啰用户昵称');
        const avatarUrl = ref('/images/avatar.png');
        const rank = ref('1');
        const title = ref('周周骑');
        const date = ref('周周骑');
        const settingsPanelOpen = ref(false);
        const generatedImageVisible = ref(false);
        const generatedImageUrl = ref('');
        const generatedImage = ref(null);
        const currentDate = ref('');

        const handleAvatarUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarUrl.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        const selectBadge = (badge) => {
            selectedBadge.value = badge;
        };

        const toggleSettingsPanel = () => {
            settingsPanelOpen.value = !settingsPanelOpen.value;
        };

        const generateFinalImage = async () => {
            const previewImage = document.querySelector('.preview-image');
            const canvas = await html2canvas(previewImage);
            generatedImageUrl.value = canvas.toDataURL('image/png');
            generatedImageVisible.value = true;
        };

        const closeGeneratedImage = () => {
            generatedImageVisible.value = false;
        };

        const saveGeneratedImage = () => {
            const link = document.createElement('a');
            link.href = generatedImageUrl.value;
            link.download = 'share_image.png';
            link.click();
        };

        const isWechat = () => {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == 'micromessenger';
        };

        const getWechatUserInfo = () => {
            if (isWechat()) {
                if (confirm('是否使用微信头像和昵称？')) {
                    wx.config({
                        debug: false,
                        appId: 'your_app_id',
                        timestamp: 'your_timestamp',
                        nonceStr: 'your_nonceStr',
                        signature: 'your_signature',
                        jsApiList: ['getUserInfo']
                    });

                    wx.ready(() => {
                        wx.getUserInfo({
                            success: (res) => {
                                nickname.value = res.nickname;
                                avatarUrl.value = res.headimgurl;
                            },
                            fail: (err) => {
                                console.error('获取微信用户信息失败', err);
                            }
                        });
                    });

                    wx.error((res) => {
                        console.error('微信 JS-SDK 配置失败', res);
                    });
                }
            }
        };
        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            currentDate.value = `${year}.${month}.${day}`;
        };

        getCurrentDate();
        getWechatUserInfo();

        return {
            selectedBadge,
            badges,
            nickname,
            avatarUrl,
            rank,
            title,
            currentDate,
            settingsPanelOpen,
            generatedImageVisible,
            generatedImageUrl,
            generatedImage,
            handleAvatarUpload,
            selectBadge,
            toggleSettingsPanel,
            generateFinalImage,
            closeGeneratedImage,
            saveGeneratedImage
        };
    }
});

app.mount('#app');
