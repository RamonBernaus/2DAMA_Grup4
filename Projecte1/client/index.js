
var app = new Vue({
    el:"#app",
    vuetify: new Vuetify(),
    data:{
        user:"",
        pwd:"",
        role:"",
        text:""
    },

    methods:{
        getUser: function(){

            console.log("Get User work");
            const myHeaders = new Headers();

            fetch("http://127.0.0.1:3000/auth/" + this.user + "/" + this.pwd, {
                method: "GET",
                headers: myHeaders,
                mode: 'cors',
            }).then(
                (response) => {
                    return response.json();
                }
            ).then(
                (data) => {
                    if (data.auth == true){
                        this.role = data.rol;
                        this.text = data.text;
                    }else{
                        this.text = data.text;
                    }
                }
            ).catch(
                (error) => {
                    console.log("ERROR!!");
                    console.log(error);
                }
            )
        },

        createUser: function(){
            
            console.log("Create User work");
            const myHeaders = new Headers();

            fetch("http://127.0.0.1:3000/create/" + this.user + "/" + this.pwd, {
                method: "GET",
                headers: myHeaders,
                mode: 'cors',
            }).then(
                (response) => {
                    return response.json();
                }
            ).then(
                (data) => {
                    this.text = data.text;
                }
            ).catch(
                (error) => {
                    console.log("ERROR!!");
                    console.log(error);
                }
            )
        }
    }
});