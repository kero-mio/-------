// 初回ページ表示時
function Load() {
    localStorage.clear();
    document.addEventListener("deviceready", onDeviceReady, false);
}
function onDeviceReady() {
    console.log(navigator.camera);
}

// 写真を撮る
function takePicture() {

      navigator.camera.getPicture (successCallback, FailCallback, {destinationType: Camera.DestinationType.DATA_URL});

      function successCallback (imageData) {
        var image = document.getElementById('picture');
        image.src = "data:image/jpeg;base64, " + imageData;
        image.style.display = "block";
      }

      function FailCallback (message) {
        alert ('Error!!!: ' + message);
      }

/* 
var image = document.getElementById('picture');
var imageData = ''
image.src = "data:image/jpeg;base64, " + imageData;
image.style.display = "block";
 */
}

function addTodo() {
    // 傘の所有者
    var owner = $("#todo-owner").val();
    // 傘の特徴
    var title = $("#todo-title").val();
    // 日時
    var todoDate = $("#todo-date").val();
    // 傘の補足情報
    var body = $("#todo-body").val();

    var image = document.getElementById('picture');

    // データ保存
    const saveData = {
        "owner": owner,
        "title": title,
        "todoDate": todoDate,
        "body": body
    };

    const imgData = image.style.display == 'block' ? image.src : ''

    const saveKey = dateToString(new Date());
    const saveValue = JSON.stringify(saveData);
    
    localStorage.setItem(saveKey, saveValue);
    
    if ( image.src.indexOf('data:image/jpeg;base64,') != -1 ) {
        localStorage.setItem(saveKey + '_img', imgData);
    }

    // 一覧ページを表示
    DisplayListPage();
}

// 一覧ページ表示
function DisplayListPage() {
    $.mobile.changePage($("#list-page"));
    $("#todo-list").empty();

    // 初期化
    var dataKey = "";
    var targetValue = {
        "owner": "",
        "title": "",
        "todoDate": "",
        "body": ""
    };
    var targetImg = null;

    // 保存データ件数分表示する
    $("#todo-list").empty();
    for (var i=0; i <localStorage.length; i++)  {
        
        dataKey = localStorage.key(i);
        
        if ( localStorage.hasOwnProperty(dataKey) && dataKey.indexOf('_img') == -1 ) {

            targetValue = JSON.parse(localStorage.getItem(dataKey));

            if ( localStorage.hasOwnProperty(dataKey + '_img') ) {
                
                targetImg = localStorage.getItem(dataKey + '_img');

                $("#todo-list").append(                   
                    "<li>" + 
                    "<h3>所有者：" + targetValue.owner + "</h3>" + 
                    "<h3>傘の特徴：" + targetValue.title + "</h3>" + 
                    "<h3>日時：" + targetValue.todoDate + "</h3>" + 
                    "<img id='" + dataKey + '_img' + "' src='" + targetImg + "' width='150' height='150'><br>" +
                    "<input type='button' value='表示' onclick='viewTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                    "<input type='button' value='編集' onclick='editTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                    "<input type='button' value='削除' onclick='deleteTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                "</li>");                 
            }
            else {
                $("#todo-list").append(
                    "<li>" + 
                    "<h3>所有者：" + targetValue.owner + "</h3>" + 
                    "<h3>傘の特徴：" + targetValue.title + "</h3>" + 
                    "<h3>日時：" + targetValue.todoDate + "</h3>" + 
                    "<input type='button' value='表示' onclick='viewTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                    "<input type='button' value='編集' onclick='editTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                    "<input type='button' value='削除' onclick='deleteTodo(\"" + dataKey + "\")' class='listMenuButton' data-key='" + dataKey +"'>" +
                "</li>");  
            } 
        }
    }
  
    $("#todo-list").listview('refresh');
}

// データ登録ページへ遷移
function createTodo() {
    // データを取得

    // 入力ページへ
    $.mobile.changePage($("#add-page"));

    // 入力エリアを有効にする
    $("#todo-owner").prop('readonly',false);
    $("#todo-title").prop('readonly',false);
    $("#todo-date").prop('readonly',false);
    $("#todo-body").prop('readonly',false);

    // 値を設定する
    $("#todo-owner").val('');
    $("#todo-title").val('');
    $("#todo-date").val('');
    $("#todo-body").val('');
    document.getElementById('picture').style.display = "none";
    document.getElementById('picture').src = "";

    // 更新ボタン→登録ボタンに
    $('.ui-btn').attr('style','display: block');
    $("#addSave").val("登録").button("refresh");
    $("#addSave").attr("onClick", "addTodo('')").button("refresh");
}

// データ更新ページへ遷移
function editTodo(dataKey) {
    // データを取得
    const targetValue = JSON.parse(localStorage.getItem(dataKey));
    const targetImg = localStorage.getItem(dataKey + '_img');

    // 入力ページへ
    $.mobile.changePage($("#add-page"));

    // 入力エリアを有効にする
    $("#todo-owner").prop('readonly',false);
    $("#todo-title").prop('readonly',false);
    $("#todo-date").prop('readonly',false);
    $("#todo-body").prop('readonly',false);

    // 値を設定する
    $("#todo-owner").val(targetValue.owner);
    $("#todo-title").val(targetValue.title);
    $("#todo-date").val(targetValue.todoDate);
    $("#todo-body").val(targetValue.body);

    if(targetImg != null) {
        document.getElementById('picture').style.display = "block";
        document.getElementById('picture').src = targetImg;
    }
    else {
        document.getElementById('picture').style.display = "none";
        document.getElementById('picture').src = ""; 
    }

    // 登録ボタン→更新ボタンに
    $('.ui-btn').attr('style','display: block');
    $("#addSave").val("更新").button("refresh");
    $("#addSave").attr("onClick", "UpdateTodoData('" + dataKey + "')").button("refresh");
}

// データ更新処理
function UpdateTodoData(datakey) {
    
    // データ更新処理
    const saveData = {
        "owner": $("#todo-owner").val(),
        "title": $("#todo-title").val(),
        "todoDate": $("#todo-date").val(),
        "body": $("#todo-body").val()
    };

    var image = document.getElementById('picture');
    const imgData = image.style.display == 'block' ? image.src : '';

    localStorage.removeItem(datakey);
    localStorage.setItem(datakey, JSON.stringify(saveData));
    
    if ( imgData != '' ) {
        localStorage.removeItem(datakey + '_img');
        localStorage.setItem(datakey + '_img', imgData);        
    }
    else {
        localStorage.removeItem(datakey + '_img');
        localStorage.setItem(datakey + '_img', '');
    }

    // 一覧ページを表示
    DisplayListPage();
}

function deleteTodo(datakey) {

    // データ削除処理
    localStorage.removeItem(datakey);
    localStorage.removeItem(datakey + '_img');

    // 一覧ページを表示
    DisplayListPage();    
}

// 表示ボタンクリック時（表示モードページへ）
function viewTodo(dataKey) {
    // データを取得
    //const dataKey = viewButton.getAttribute('data-key');
    //document.getElementById('view-button').getAttribute('data-key');
    const targetValue = JSON.parse(localStorage.getItem(dataKey));
    const targetImg = localStorage.getItem(dataKey + '_img')

    // 入力ページへ
    $.mobile.changePage($("#add-page"));

    // 値を設定する
    $("#todo-owner").val(targetValue.owner);
    $("#todo-title").val(targetValue.title);
    $("#todo-date").val(targetValue.todoDate);
    $("#todo-body").val(targetValue.body);
    if ( targetImg != '' ) {
        document.getElementById('picture').src = targetImg;
        document.getElementById('picture').style.display = 'block';
    }
    else {
        document.getElementById('picture').src = '';
        document.getElementById('picture').style.display = 'none';
    }

    // 入力エリアを読み取り専用にする
    $("#todo-owner").prop('readonly',true);
    $("#todo-title").prop('readonly',true);
    $("#todo-date").prop('readonly',true);
    $("#todo-body").prop('readonly',true);

    // 登録ボタンを非表示にする
    $('.ui-btn').attr('style','display: none');
    // 上記で登録ボタンを非表示にすると「戻る」ボタンまで非表示になるため、戻るボタンは表示するようにする
    $('.ui-btn-left').attr('style','display: block');
}

// 戻るボタンクリック時
function backPage() {
    // 登録ボタンを表示にする
    $('.ui-btn').attr('style','display: block');
    // 「戻る」ボタンまで非表示にする
    $('.ui-btn-left').attr('style','display: none');    
}

/**
 * Date オブジェクトを yyyyMMddHHmmss 形式の文字列に変換
 * @param {Date} date 変換対象の Date オブジェクト
 */
function dateToString(date) {
    const strYear = String(date.getFullYear()).padStart(4, '0')
    const strMonth = String(date.getMonth()).padStart(2, '0')
    const strDate = String(date.getDate()).padStart(2, '0')
    const strHour = String(date.getHours()).padStart(2, '0')
    const strMin = String(date.getMinutes()).padStart(2, '0')
    const strSec = String(date.getSeconds()).padStart(2, '0')
    return strYear + strMonth + strDate + strHour + strMin + strSec
}
