var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var recurence = 0;
var recurence2 = 0;
var width = canvas.width;
var height = canvas.height;
var nombreballes = document.getElementById("sliderRange");
var output = document.getElementById("demo");
output.innerHTML = nombreballes.value;
var vitesse = document.getElementById("slid");
var oui = document.getElementById("test");
var slider = document.getElementById("slidgaz");
var repartition = 50;
var repartition2 = 50;
var pressionval = document.getElementById("pression");
var valpre = document.getElementById("val");
valpre.innerHTML="en Pascal";
pressionval.innerHTML = 50;
var tempval = document.getElementById("temperature");
tempval.innerHTML = "     En projet";
var murpos;

//Mur pour réduire l'espace
document.addEventListener('keydown', (event) => {
    var nomTouche = event.key;
    if (nomTouche === 'ArrowLeft') {
        updateMurGauche();
        updateMurGauche();
        updateMurGauche();
    }
    if (nomTouche === 'ArrowRight') {
        updateMurDroit();
        updateMurDroit();
    }
}, false);

var mur = {
    x: -5,
    y: 0,
    velX: 1,
    radius: 10
}

Ball.prototype.murBounce = function () {
    if (this.velX - 10 < 0 && this.velX < 0 && (this.x - (mur.x + mur.radius) <= this.radius)) {
        if (this.velX < 0) {
            this.velX = -this.velX;
            Pression[iPression] = 2 * this.velX; // >0
        }
        if (this.velX < mur.velX) {
            this.velX += mur.velX;
            Pression[iPression] += mur.velX; //>0
        }
    }
    if (this.x <= mur.x + this.radius && this.velX < mur.velX) {
        this.velX += mur.velX;
        Pression[iPression] += mur.velX; //>0
    }
}


function displayMur() {
    ctx.beginPath();
    ctx.fillStyle = 'brown'
    ctx.fillRect(mur.x, mur.y, mur.radius, height);
}

function updateMur() {
    if (mur.x < murpos - 60) {
        mur.x += mur.velX;
    } else if (mur.x > murpos - 60)
        mur.x -= mur.velX;
}

function updateMurDroit() {
    mur.x += mur.velX;
}

function updateMurGauche() {
    mur.x -= mur.velX;
}

function random(min, max) {
    var num = Math.random() * (max - min + 1) + min;
    return num;
}

var EcMoy = 0;
function setEcMoy() {
    var Vmoy = 0
    for (var i = 0; i < balls.length; i++) {
        EcMoy += balls[i].ec; //addition de toutes les EC
        Vmoy += Math.abs(balls[i].velX) + Math.abs(balls[i].velY);
    }
    Vmoy = Vmoy / balls.length;
    EcMoy = EcMoy / balls.length; // moyenne
    var v = Vmoy; //scale up to m.s
    var n = balls.length; //nb mol
    var m = 16 * 1.66 * Math.pow(10, -27); //kg   16 u    OK nb particules/
    n *= 1 * Math.pow(10, 6); // nb/cm3
    //Ec en kg.m^2/v^2
    //EcMoy=0.5*m* v*v;
}


var kTemp = 0;
function setKTemp() {
    var csteBolmann = 1.380649 * Math.pow(10, -23);
    var n = balls.length; //nb mol
    kTemp = (EcMoy) / ((3 / 2) * csteBolmann) + 112 + 20;
}

var cTemp = 0;
function setCTemp() {
    cTemp = kTemp - 273.15;
}

var Pression = [0];
var iPression = 0;
Pression[iPression] = 0;
pressInit();
var fps = 60;
var Tpression = 1; //duree en seconde sur laquelle est basée la moyenne de la pression

function pressInit() {
    for (var l = 0; l <= fps * Tpression; l++)
        Pression[l] = 0;
}

var pressionMoy = 0;
function gestionPression() {
    Pression[iPression] = Pression[iPression] / balls.length; //val pression moy à t moment
    iPression = iPression % (fps * Tpression) + 1; //+/- 300 valeurs d'impacts (pour 5s acceptable)
}

function getPressionMoy() {
    var u = 0;
    for (var it = 0; it < Pression.length; it++) {
        if (Pression[it] > 0) {
            u = it;
            pressionMoy += Pression[it];
        }
    }
    pressionMoy = pressionMoy / u;
    //console.log(pressionMoy); //Affichage de la temperature dans la console
}

function Ball(x, y, velX, velY, color, radius) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.radius = radius;
    this.mass = 5
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'White';
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}
var vitesseHTML = 50;



Ball.prototype.update = function () {
    if ((this.x + this.radius) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.radius) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.radius) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.radius) <= 0) {
        this.velY = -(this.velY);
    }
    this.murBounce();
    this.x += this.velX * (vitesseHTML / 50);
    this.y += this.velY * (vitesseHTML / 50);
    //var v = this.velX + this.velY;
    //this.ec = 1 / 2 * this.mass * Math.pow(v, 2);
}
//ec moy=3/2 * nbparticule*cste bolmann*temp;
//temp=2*cste bolmann)
//ec=2/6*m(v²)/(kb*T)


//ec= N*1/2*m(v²) = 3/2*N*Kb*T
//kb constant boltzmann
//N nb particule   = 2*10^15 
//T temp en kelvin


//T=(ecmoy*2)/(3*N*kb)	


//ec moy=3/2 * nbparticule*cste bolmann*temp;
//temp=(ec moy*2)/(3*nbparticule*cste bolmann)
//ec =  1/2 mV^2
//V=velX+velY;

Ball.prototype.bounce2 = function (ball2) {
    var res = [this.velX - ball2.velX, this.velY - ball2.velY]; //res [diff velX,diff VelY]
    if (res[0] * (ball2.x - this.x) + res[1] * (ball2.y - this.y) >= 0) { //detection de collision qui change tout
        //si la difference de position * vitesse d'approche >0 calculer
        var m1 = this.mass
        var m2 = ball2.mass
        var theta = -Math.atan2(ball2.y - this.y, ball2.x - this.x); //angle de collision
        var v1 = rotate(this.getV(), theta);
        var v2 = rotate(ball2.getV(), theta);
        var u1 = rotate([v1[0] * (m1 - m2) / (m1 + m2) + v2[0] * 2 * m2 / (m1 + m2), v1[1]], -theta);
        var u2 = rotate([v2[0] * (m2 - m1) / (m1 + m2) + v1[0] * 2 * m1 / (m1 + m2), v2[1]], -theta);

        this.velX = u1[0];
        this.velY = u1[1];
        ball2.velX = u2[0];
        ball2.velY = u2[1];
    }
}

Ball.prototype.bounce22 = function (ball2) {
    var res = [this.velX - ball2.velX, this.velY - ball2.velY]; //res [diff velX,diff VelY],    vecteur v[x,y] 
    if (res[0] * (ball2.x - this.x) + res[1] * (ball2.y - this.y) >= 0) { //detection de collision qui change tout
        //si la difference de position * vitesse d'approche >0 calculer
        var m1 = this.mass
        var m2 = ball2.mass
        var theta = -Math.atan2(ball2.y - this.y, ball2.x - this.x); //angle de collision
        var v1 = rotate(this.getV(), theta); //vecteur ball1
        var v2 = rotate(ball2.getV(), theta); //vecteur ball2

        var V = Math.abs(res[0]) + Math.abs(res[1]);
        var u1 = [v1[0] * (m2 / (m1 + m2)) + V / 2, v1[1] * (m2 / (m1 + m2)) + V / 2];
        var u2 = [v2[0] * (-m1 / (m1 + m2)) + V / 2, v2[1] * (-m1 / (m1 + m2)) + V / 2];

        this.velX = u1[0];
        this.velY = u1[1];
        ball2.velX = u2[0];
        ball2.velY = u2[1];
    }
}

Ball.prototype.getV = function () {
    return [this.velX, this.velY];
}

function rotate(v, theta) {
    return [v[0] * Math.cos(theta) - v[1] * Math.sin(theta), v[0] * Math.sin(theta) + v[1] * Math.cos(theta)];
}

function distance(b1, b2) { //renvoi distance 2 points
    var distX = b1.x - b2.x;
    var distY = b1.y - b2.y;
    return Math.sqrt(distX * distX + distY * distY)
}

function rebond() {
    for (var l = 0; l < balls.length - 1; l++) {
        for (var j = 1; j < balls.length; j++) {
            if (distance(balls[l], balls[j]) < (balls[l].radius + balls[j].radius)) {
                balls[l].bounce2(balls[j]);
            }
        }
    }
}



var tgaz1 = [];
var tgaz2 = [];

function gaz1() {
    v = [500 / 333, 0]; //vitesse hydrogene 500 m.s
    v = rotate(v, random(0, 360));
    var ball = new Ball(
        random(mur.x, width), //x
        random(0, height), //y
        v[0], //velx
        v[1], //vely
        'red', //couleur
        random(10, 15) //radius
    );
    tgaz1.push(ball);
}

function gaz2() {
    v = [333 / 333, 0]; //dioxygene meme coef 333ms
    var r = Math.floor(random(0, 360));
    v = rotate(v, r);
    var ball = new Ball(
        random(mur.x, width), //x
        random(0, height), //y
        v[0], //velx
        v[1], //vely
        'deepskyblue', //couleur
        random(15, 20) //radius
    );
    tgaz2.push(ball);
}

var balls = [];

while (tgaz1.length < 25) { //Initialisation des 50 balles au lancement de la simulation
    gaz1();
    gaz2();
}

var rectXi = 0;

function montest() { //Mode surface lorsque le bouton est cliqué
    if (rectXi == 3000) {
        window.location.reload();
    }
    if (rectXi == 0) {
        alert("Ce mode a pour but d'étudier la dispersion des Gaz.");
        rectXi = 3000;
    }
}

function auMillieme(nombre) { //Fonction pour arrondir au millieme la valeur de la pression
    return Math.round(1000 * nombre) / 1000;
}

var tmpTime = 0;

function loop(time) { //time= temps execution du programme
    time = time / 60 / 60 * 5; // met le temps en seconde +/-

    ctx.fillStyle = 'Black';
    ctx.fillRect(rectXi, 0, width, height);

    var dif2 = ((repartition2 * output.innerHTML) / 100);
    var dif1 = ((repartition * output.innerHTML) / 100) - 1;

    if (Math.abs(tgaz1.length - dif1) > 1) {
        if (tgaz1.length > dif1) {
            tgaz1.pop();
        }
        if (tgaz1.length < dif1) {
            gaz1();
        }
    }
    
    if (Math.abs(tgaz2.length - dif2) > 1) {
        if (tgaz2.length > dif2) {
            tgaz2.pop();
        }
        if (tgaz2.length < dif2) {
            gaz2();
        }
    }

    setTimeout(rebond(), 0); // met la detection et calcul du rebond dans un thread

    for (var h = 0; h < balls.length + 101; h++) { //On vide le tableau balls entierement
        balls.pop();
    }
    
    Array.prototype.push.apply(balls, tgaz1); //On met tout le tableau de tgaz1 dans balls
    Array.prototype.push.apply(balls, tgaz2); //On ajoute tout le tableau de tgaz2 dans balls

    for (var p = 0; p < balls.length; p++) {
        balls[p].draw();
        balls[p].update();
    }
    displayMur();
    updateMur();
    setEcMoy();
    setKTemp(); 
    setCTemp();
    gestionPression();

    //Actualise la pressionMoy toutes les Tpression secondes
    if (time % Tpression <= 0.05 && time - tmpTime > 4) {
        pressionMoy = 0;
        tmpTime = time;
        getPressionMoy();
    }
    pressionval.innerHTML =pressionMoy * 2.999*Math.pow(10,-17);
    requestAnimationFrame(loop);
}
gestionPression();
getPressionMoy();
loop();

nombreballes.oninput = function () { //Slider Nb de Balles
    output.innerHTML = this.value;
}

vitesse.oninput = function () { //Slider vitesse
    vitesseHTML = this.value;
}

slider.oninput = function () { //Slider Repartition des molécules
    repartition = this.value;
    repartition2 = 100 - repartition - 1;
}

//https://codepen.io/Full_of_Symmetries/pen/qqazdW
