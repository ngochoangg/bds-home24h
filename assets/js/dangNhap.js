jQuery(($) => {
    console.log("Trang dang nhap");
    const localToken = getLocalStorage("Token");

    $(document).on("click", ".btn-login", () => {
        console.log("login");
    })

    if (localToken) {
        let prevPage = localStorage.getItem("current");
        window.location.assign(prevPage);
    }

    //Get local stored
    function getLocalStorage(itemKey) {
        return localStorage.getItem(itemKey);
    }
})