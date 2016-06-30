
function loginOptions(){
    if(localStorage.getItem("name")){
        $("#loginOptions").hide();
        $("#logoutOptions").show();
        $("#message").html("Welcome, "+ localStorage.getItem("name"));
    } else {
        $("#loginOptions").show();
        $("#logoutOptions").hide();
    }
}

function getAllPosts(){
    $.get("/allPosts", function(data) {
        // console.log(data);
        var panelHtml = "";
        if(data.allPosts.length != 0){
            for(var i = 0;i<data.allPosts.length;i++){
                // var panelTemplate = $("#panelTemplate").html();

                // console.log(data.allPosts[i]);
                // if(localStorage.getItem('user') == data.allPosts[i].uId){
                //     data.allPosts[i].deleteButton = $("#deleteTemplate").html();
                // }
                // $.html(panelHtml,data.allPosts[i]).appendTo("#myPosts");
                panelHtml += '<div class="panel panel-default">';
                panelHtml += '<div class="panel-heading clearfix">';
                if(localStorage.getItem('user') == data.allPosts[i].uId){
                    panelHtml += '<div class="btn-group pull-right"><a href="#" onclick="deleteThisItem(\''+data.allPosts[i].pId+'\')" class="btn btn-danger btn-sm">x</a></div>';
                    panelHtml += '<div class="btn-group pull-right" data-target="#uArticle" data-toggle="modal"><a href="#" onclick="updateThisItem(\''+data.allPosts[i].pId+'\')" class="btn btn-info btn-sm"><span class="glyphicon glyphicon-repeat"></span></a></div>';

                }
                panelHtml += '<h3 class="panel-title">'+data.allPosts[i].title+' <small>Posted By:'+data.allPosts[i].username+'</small></h3> </div>';
                panelHtml += '<div class="panel-body">'+data.allPosts[i].content+'</div>';
                panelHtml += '</div>';
            }
            // console.log(data.allPosts);
            // alert("function getallPosts is being called");

        } else {
            panelHtml += '<div class="panel panel-default">';
            panelHtml += '<div class="panel-heading"><h3 class="panel-title">No Posts</h3></div>';
            panelHtml += '<div class="panel-body">EMPTY</div>';
            panelHtml += '</div>';
        }

        document.getElementById("myPosts").innerHTML = panelHtml;


        // $("#myPosts").html(panelHtml);

        //  var html = "<ul>";

        //  for(var i = 0;i<data.allusers.length;i++){
        //      html +="<li>"+data.allusers[i].firstname+", "+data.allusers[i].lastname+" ("+data.allusers[i].username+")</li>";
        //  }
        //   html += "</ul>";
            // $("#allUsers" ).html( html );
    });
}

function deleteThisItem(pid){
    var data = {postId:pid};
    $.post('/deletePost', data, function(resp) {
        getAllPosts();
    });
    
}

function updateThisItem(pid){
    var data = {
        postId:pid    
    };
    // alert(pid);
    localStorage.setItem('updateId', pid);
    // $('#newArticle').modal('show');

    $.post('/updatePost', data, function(resp) {

        document.getElementById("uTitle").value = resp.title;
        $("#uContent").html(resp.content);

        // alert("success");
        // getAllPosts();

        console.log(resp.title);
        console.log(resp.content);


    });
}

$(document).ready(function(){
    loginOptions();
    getAllPosts();
});

$('#signoutBtn').click(function(){
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    loginOptions();
    getAllPosts();
});

$('#saveArticle').click(function(){
    var title = $('#title').val();
    var content = $('#content').val();
    var postedBy = localStorage.getItem('user');
    var data = {
        "title":title,
        "content":content,
        "postedBy":postedBy
        };
    $.post('/addNewPost', data, function(resp) {
        if(typeof resp.error != "undefined"){
            alert(resp.error);
        } else {
            $('#newArticle').modal('hide');
            getAllPosts();
        }
    });

});

$('#updateBtn').click(function() {

    var title = $('#uTitle').val();
    var content = $('#uContent').val();
    var updateId = localStorage.getItem('updateId');
    console.log(updateId);
    var data = {
        "pId":updateId,
        "title":title,
        "content":content,
        };

    $.post('/updateDatabase', data, function(resp) {

        if(typeof resp.error != "undefined"){
            alert(resp.error);
        } else {
            $('#uArticle').modal('hide');
            getAllPosts();
        } 
    });

});

$('#loginform').submit(function(event) {
    event.preventDefault(); 
    var data = {username:$("#inputEmail").val(),password:$("#inputPassword").val()}
    $.post('/login', data, function(resp) {
        if(typeof resp.error != "undefined"){
            alert(resp.error);
        } else {
            //login Successful
            $('#signin').modal('hide');
            localStorage.setItem("user",resp.userId);
            localStorage.setItem("name",resp.fullname);
            loginOptions();
            getAllPosts();
        }
    });
});

$('#registerform').submit(function(event) {
    event.preventDefault(); 
    var data = {username:$("#email").val(),password:$("#password").val(), lastname:$("#last_name").val(),firstname:$("#first_name").val()};
    $.post('/register', data, function(resp) {
        if(typeof resp.error != "undefined"){
            alert(resp.error);
        } else {
            //login Successful
            alert("Success");
            $('#register').modal('hide');
            console.log("RESPO:"+resp.userId);
            localStorage.setItem("user",resp.userId);
            localStorage.setItem("name",$("#first_name").val() +" "+$("#last_name").val());
            // $("#loginOptions").hide();
            // $("#logoutOptions").show();
            // $("#message").html("Welcome, "+ localStorage.getItem("name"));
            loginOptions();
        }
    });
});