jQuery(($) => {
    const gURL = "http://question-env.eba-es2s4tgm.ap-southeast-1.elasticbeanstalk.com";
    const gToken = getTokenFromLocal();

    getPostStatus("open");

    function getPostStatus(status) {
        let result = null;
        $.ajax({
            type: "GET",
            url: `${gURL}/post/stat?s=${status}`,
            headers: {
                "Authorization": `Token ${gToken}`
            },
            success: async (res) => {
                result = await res;
            }
        });
        return result;
    }


    //Get token 
    function getTokenFromLocal() {
        return window.localStorage.getItem("Token");
    }
})