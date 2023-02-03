jQuery(($) => {
    const gURL = "https://hoangvn.azurewebsites.net";
    const gToken = getTokenFromLocal();


    let chart = new Chart($("#reportsChart")[0].getContext("2d"), {
        type: 'pie',
        data: {
            labels: [
                "Chưa duyệt",
                "Đã duyệt",
                "Đã đóng"
            ],
            datasets: [{
                label: '# post',
                backgroundColor: [
                    'rgb(65 89 243)',
                    'rgb(46 202 106)',
                    'rgb(255 119 29)'
                ],
                hoverOffset: 4,
                data: [0, 0, 0]
            }]
        }
    })

    init();


    //Function get cases by status
    function getPostStatus(status) {
        return $.ajax({
            type: "GET",
            url: `${gURL}/post/stat?s=${status}`,
            headers: {
                "Authorization": `Token ${gToken}`
            }
        });
    }


    //init
    function init() {
        getPostStatus("open").done(async res => {
            $("#openCaseCardLength").html(res);
            chart.data.datasets[0].data[0] = await res || 0;
            chart.update();
        });
        getPostStatus("confirmed").done(async res => {
            $("#confirmCaseCardLength").html(res);
            chart.data.datasets[0].data[1] = await res || 0;
            chart.update();
        })
        getPostStatus("closed").done(async res => {
            $("#closedCaseCardLength").html(res);
            chart.data.datasets[0].data[2] = await res || 0;
            chart.update();
        })
    }

    //Get token 
    function getTokenFromLocal() {
        return window.localStorage.getItem("Token");
    }
})