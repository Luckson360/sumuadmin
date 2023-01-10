  //the government [part]
  var government = Math.ceil(Math.random() * 10000000);
  var byHand = Math.ceil(Math.random() * 5)
  console.log(byHand)
  var byArr = ["kd","iuh","jei","ijej","oieoj","ijoj","ie","oej","jiej","bhb"]
  var aa = ["a","the","b","c","d","e","f","g","h","i"]
  var govEl = document.querySelector("#govrand")
  var govEl2 = document.querySelector("#governmentRand")


  govEl.value = government + byArr[byHand] + aa[byHand];
  govEl2.value = government + byArr[byHand] + aa[byHand];