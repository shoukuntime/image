$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
    $("#inputImageFile").change(function(e){
        processImageFile(e.target.files[0]);
    });
});

function processImageFile(imageObject) {

    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://"+myRegion+".api.cognitive.microsoft.com/";
    // var uriBase = url + "vision/v2.1/analyze";
    var uriBase = url + "vision/v2.1/describe";

    //params for analyze
    // var params = {
    //     "visualFeatures": "Adult,Brands,Categories,Description,Faces,ImageType,Objects,Tags",
    //     "details": "Landmarks",
    //     "language": "zh",
    // };

    //params for describe
    var params = {
        "maxCandidates": "10",
        "language": "zh",
    };

    //顯示分析的圖片
    // var sourceImageUrl = document.getElementById("inputImage").value;
    var sourceImageUrl = URL.createObjectURL(imageObject);
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        processData: false,
        contentType:false,
        // Request body
        data: imageObject
    })
        .done(function (data) {
            //顯示JSON內容
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            $("#picDescription").empty();

            //for describe
            //show all captions & confidence
            var captions = data.description.captions;
            $("#picDescription").append("<ul>");
            for (var i = 0; i < captions.length; i++) {
                let thisItem = "";
                thisItem += "<li>";
                thisItem += captions[i].text;
                thisItem += `(${captions[i].confidence.toFixed(2)})`;
                thisItem += "</li>";
                $("#picDescription").append(thisItem);
            }
            $("#picDescription").append("</ul>");

            //for analyze
            // $("#picDescription").text(data.description.captions[0].text);
            // $("#picDescription").append("<br>");
            // $("#picDescription").append("這裡有 " + data.faces.length + " 張臉");
            // //list all unique objects and how many times they appear
            // var objects = data.objects;
            // var objCount = {};
            // for (var i = 0; i < objects.length; i++) {
            //     var obj = objects[i].object;
            //     if (obj in objCount) {
            //         objCount[obj]++;
            //     } else {
            //         objCount[obj] = 1;
            //     }
            // }
            // $("#picDescription").append("<br>");
            // $("#picDescription").append("全部有 " + objects.length + " 個物體");
            // $("#picDescription").append("<br>");
            // for (var obj in objCount) {
            //     $("#picDescription").append(obj + ": " + objCount[obj]);
            //     $("#picDescription").append("<br>");
            // }

        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //丟出錯誤訊息
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
};

function processImage() {
    
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://" + myRegion + ".api.cognitive.microsoft.com/";
    // var uriBase = url + "vision/v2.1/analyze";
    var uriBase = url + "vision/v2.1/describe";
    
    //params for analyze
    // var params = {
    //     "visualFeatures": "Adult,Brands,Categories,Description,Faces,ImageType,Objects,Tags",
    //     "details": "Landmarks",
    //     "language": "zh",
    // };

    //params for describe
    var params = {
        "maxCandidates": "10",
        "language": "zh",
    };

    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        $("#picDescription").empty();

        //for describe
        //show all captions & confidence
        var captions = data.description.captions;
        $("#picDescription").append("<ul>");
        for (var i = 0; i < captions.length; i++) {
            let thisItem = "";
            thisItem += "<li>";
            thisItem += captions[i].text;
            thisItem += `(${captions[i].confidence.toFixed(2)})`;
            thisItem += "</li>";
            $("#picDescription").append(thisItem);
        }
        $("#picDescription").append("</ul>");

        //for analyze
        // $("#picDescription").text(data.description.captions[0].text);
        // $("#picDescription").append("<br>");
        // $("#picDescription").append("這裡有 " + data.faces.length + " 張臉");
        // //list all unique objects and how many times they appear
        // var objects = data.objects;
        // var objCount = {};
        // for (var i = 0; i < objects.length; i++) {
        //     var obj = objects[i].object;
        //     if (obj in objCount) {
        //         objCount[obj]++;
        //     } else {
        //         objCount[obj] = 1;
        //     }
        // }
        // $("#picDescription").append("<br>");
        // $("#picDescription").append("全部有 " + objects.length + " 個物體");
        // $("#picDescription").append("<br>");
        // for (var obj in objCount) {
        //     $("#picDescription").append(obj + ": " + objCount[obj]);
        //     $("#picDescription").append("<br>");
        // }

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};