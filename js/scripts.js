$(document).ready(function() {
  
  $('#name1,#test1,#name2,#test2').keyup(function() {
    var hidden = false;
    $('#name1,#test1,#name2,#test2').each(function() {
      if ($(this).val().length == 0) {
      hidden = true;
      }
    })
    
    if (hidden) {
      $('#bdsmbutton').hide();
    } else {
      $('#bdsmbutton').show();
    }
    
  });
  
  $('#bdsmbutton').click(function(){
    clear($('#bdsmtable > tbody'));
    processBdsm();
    $('#thname1').text($("#name1").val());
    $('#thname2').text($("#name2").val());
    $('#bdsmtable').show();
  });
  
  $('#bdsmsection').hide();
  $('#showbdsm').click(function(){
    $('#bdsmsection').animate({"opacity": "toggle"});
  });
  
});

//Adding a class to make kink sorting prettier
class Kink {
  constructor(name1, name2, polarized) {
    this.name1 = name1;
    this.name2 = name2;
    this.polarized = polarized;
    this.value1 = 0;
    this.value2 = 0;
    this.combined = 0; //Two values above combined
  }
  
  addValue1(amount) {
    this.value1 = amount;
  }
  
  addValue2(amount) {
    this.value2 = amount;
  }
  
  combine() {
    this.combined = Number(this.value1) + Number(this.value2);
  }
}


var generalk = ['Ageplayer', 'Vanilla', 'Voyeur', 'Experimentalist', 'Exhibitionist', 'Non-monogamist', 'Switch'];
var polarizedk = {'Degradee': 'Degrader', 'Rope bunny': 'Rigger', 'Submissive': 'Dominant', 'Boy/Girl': 'Daddy/Mommy', 'Pet': 'Owner', 'Masochist': 'Sadist', 'Primal (Prey)': 'Primal (Hunter)', 'Brat': 'Brat tamer', 'Slave': 'Master/Mistress'};
var allkinks = [];

for (var i = 0; i < generalk.length; i++) {
  kink = new Kink(generalk[i], generalk[i], false);
  allkinks.push(kink);
}

for (const [key, value] of Object.entries(polarizedk)) {
  kink = new Kink(value, key, true);
  allkinks.push(kink);
  kink = new Kink(key, value, true);
  allkinks.push(kink);
}

function processBdsm() {
  var test1 = $('#test1').val();
  test1 = readTest(test1);
  var test2 = $('#test2').val();
  test2 = readTest(test2);
  
  convertKinks(test1, test2);
  
  for (i=0; i<allkinks.length; i++){
    allkinks[i].combine();
  }
  
  allkinks.sort(compare);
  allkinks.reverse();
  report();
}

function readTest($param) {
  $param = $param.replace("\r\n", "\n");
  $param = $param.replace("%", "");
  $param = $param.split("\n");
  
  for (i=0;i<$param.length;i++){
    if ($param[i].indexOf("==") >= 0) {
      $param.splice(i, 1);
    }
    if ($param[i].indexOf("bdsmtest.org") >= 0) {
      $param.splice(i, 1);
    }
  }
  return $param;
}

function convertKinks(test1, test2) {

  for (i=0; i<test1.length; i++) {
    data = test1[i].split(" ");
    value = data[0].replace("%", "");
    data.splice(0, 1);
    
    kname = data.join(" ").trim();
    
    for (j=0; j<allkinks.length; j++) {
      if (allkinks[j].name1 == kname) {
        allkinks[j].addValue1(value);
      }
    }
  }
  for (i=0; i<test2.length; i++) {
    data = test2[i].split(" ");
    value = data[0].replace("%", "");
    data.splice(0, 1);
    
    kname = data.join(" ").trim();
    
    for (j=0; j<allkinks.length; j++) {
      if (allkinks[j].name2 == kname) {
        allkinks[j].addValue2(value);
      }
    }
  }
}

function compare(a,b) {
  if (a.combined < b.combined)
     return -1;
  if (a.combined > b.combined)
    return 1;
  return 0;
}

function report() {
  for (i=0; i<allkinks.length; i++) {
    if (allkinks[i].polarized) {
      $('#bdsmtable > tbody:last-child').append(`<tr><td>${allkinks[i].value1}</td><td style="text-align:center; !important">${allkinks[i].name1}</td><td style="text-align:center; !important">${allkinks[i].name2}</td><td style="text-align:right; !important">${allkinks[i].value2}</td></tr>`)
    } else {
      $('#bdsmtable > tbody:last-child').append(`<tr><td>${allkinks[i].value1}</td><td colspan="2" style="text-align:center; !important">${allkinks[i].name1}</td><td style="text-align:right; !important">${allkinks[i].value2}</td></tr>`)
    }
  }
}

function clear($param) {
  $param.empty();
}
