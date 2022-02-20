const primaryDisplay = document.querySelector('.primary-display');
const secondaryDisplay = document.querySelector('.secondary-display');
const buttons = document.querySelector('.buttons-container');
let operator = '';
let firstNumber = '';
let isPrevOperator = false;

// operatöre göre hesaplama işlemini yapan fonksiyon
function calculate() {
  switch (operator) {
    case '+':
      return Number(firstNumber) + Number(primaryDisplay.innerHTML);
    case '-':
      return Number(firstNumber) - Number(primaryDisplay.innerHTML);
    case 'x':
      return Number(firstNumber) * Number(primaryDisplay.innerHTML);
    case '÷':
      return Number(firstNumber) / Number(primaryDisplay.innerHTML);
  }
}
// event Listener'ı butonlara değil butonların içinde bulunduğu container'a atıyorum.
// bkz event propogation, event bubbling
buttons.addEventListener('click', (event) => {
  // tuşlar dışında bir yere tıklandıysa hiç bir işlem yapmadan işlemi sonlandırıyorum
  if (!event.target.classList.contains('button')) return;

  let primaryValue = primaryDisplay.innerHTML;
  let buttonValue = event.target.innerHTML;

  // classList adından da anlaşılacağı üzerinde üzerine tıkladığımız elementin tüm class'larını bir array şeklinde saklar
  // classList'i kontrol ederek yapılacak işleme/fonksiyona kadar veriyorum

  // ac tuşuna basıldıysa sıfırlama işlemi yapıyorum
  if (event.target.classList.contains('ac')) {
    operator = '';
    firstNumber = '';
    primaryDisplay.innerHTML = '0';
    secondaryDisplay.innerHTML = '';
  }

  // herhangi bir rakama basıldıysa
  if (event.target.classList.contains('number')) {
    // ekrankdaki hali hazırdaki rakamların uzunluğuna bakıyorum. benim ekranım maksimum 7 rakama izin veriyor. sonra taşıyor.
    // bu nedenle böyle bir kontrol ekleyerek 7 den fazla rakam olduğunda onu artık kale almıyorum
    if (primaryValue.length < 7)
      if (primaryValue !== '0') {
        // ekranda sadece 0 rakamı varsa farklı bir işlem yapmam lazım yoksa farklı işlem yapmam lazım
        // ekranda tek başına 0 yoksa o zaman tıklanan rakamı ekrana ekliyorum
        primaryDisplay.innerHTML += buttonValue;
      } else if (buttonValue !== '0') {
        // ekranda 0 tek başına ise ve tıklanan rakam 0 dan farklı ise o zaman girilen rakamı tek başına ekrana yazdırıyorum. böylece 0 silinmiş oluyor
        primaryDisplay.innerHTML = buttonValue;
      } // aksi durumda herhangi bir işlem yaptırmıyorum. yani ekran 0 ise ve tıklanan rakam 0 ise hiç bir işlem yapmıyorum. boşa giden bir tıklama oluyor.
  }

  // - tuşuna tıklandıysa
  if (event.target.classList.contains('pm')) {
    // ekrandaki mevcut sayıya bakıyorum. innerHTML olarak aldığım için her ne kadar rakam da olsa benim zihnime göre aslında veri tipi olarak string
    // o string'in ilk karakterine bakıyorum. - işareti var mı diye.
    // - işareti varsa kaldırmam lazım
    // - işaretinden sonraki kısmı ekrana yazdırıyorum
    if (primaryValue[0] == '-')
      primaryDisplay.innerHTML = primaryValue.substring(1);
    // ekranda - işareti yoksa
    // ekran uzunluğu 7'den küçükse ve ekrandaki rakam sadece 0 değilse
    // o zaman - işaretini eklemem lazım
    // ekranın başına - ekleyip geri kalan ne varsa peşine koyuyorum
    else if (primaryValue.length < 7 && primaryValue !== '0')
      primaryDisplay.innerHTML = '-' + primaryValue;
  }

  // . tuşuna basıldıysa
  if (event.target.classList.contains('decimal')) {
    // ekrandaki sayıda hali hazırda . işareti var mı diye bakıyorum
    // yoksa sayının en sonuna . işareti ekliyorum
    if (!primaryValue.includes('.')) {
      primaryDisplay.innerHTML += '.';
    }
    // varsa kale almıyorum ve hiçbir işlem yapmıyorum
  }

  // operatör tuşları olan + * - / tuşlarından birine basıldıysa
  if (event.target.classList.contains('operator')) {
    // bir önceki basılan tuş operatör tuşu mu onu kontrol etmem lazım. peş peşe operatör tuşuna basıldı mı onu kontrol etmem lazım
    // bunun için isPrevOperator değişkenini kullanıyorum, ilk baştaki değerini false olarak belirlemiştim kodun en başında
    // peş peşe operatör tuşuna basılmadıysa
    if (!isPrevOperator) {
      // en üsteki ekranım yani sonuç ekranım yani secondaryDisplay boş mu değil mi ona bakmam lazım
      // bir de halihazırda aktif bir operatör var mı buna da bakmam lazım
      // sonuç ekranım boş değilse ve aktif bir operatörüm varsa o zaman önce işlemi yapmam sonra yeni tıklanan operatörü aktif operatör yapmam lazım
      // misal benim sonuç ekranım "12 +" şeklinde ve birinci ekranda "6" rakamı var ve "-" operatörüne basıldı
      // - operatörüne yönelik işlemlere başladan önce mevcut işlemi icra etmek yani 12+6 işlemi yapıp bunu sonuç ekranına yazdırıp sonuna "-" operatörünü eklemek lazım
      // yani sonuç ekranımız artık "18 -" halini almalı
      if (secondaryDisplay.innerHTML && operator) {
        // sonuç ekranım boş değilse ve aktif bir operatörüm varsa önce o işlemi yapıp sonucu firstNumber değişkenimde saklıyorum
        // işlemi yukarıda tanımladığım calculate fonksiyonunu çağırarak yaptırıyorum
        firstNumber = calculate();
        // sonuç ekranım boşsa veya aktif bir operatörüm yoksa o zaman ana ekramındaki sayıyı firstNumber değişkenime atıyorum
      } else firstNumber = primaryValue;
      // her 2 durumda da ana ekranımı sıfırlıyorum
      primaryDisplay.innerHTML = '0';
    }
    // tıklanan operatörü sonraki işlemlerde kullanacağım için global skopta tanımladığım operatör değişkenimde saklıyorum
    operator = buttonValue;
    // sonuç ekranıma sonuç sayısını, yani firstNumber değişkenini ve girilen operatörü ekliyorum
    secondaryDisplay.innerHTML = firstNumber + ' ' + operator;
    // peş peşe operatör tuşuna basıldı mı konrolünü yapmam için en son basılan tuşun operatör olduğunu true yapıyorum
    isPrevOperator = true;
  } else isPrevOperator = false; // operatör tuşu haricinde bir tuşa basıldıysa o zaman bunu false yapıyorum

  // = tuşuna basıldıysa
  if (event.target.classList.contains('equal')) {
    // yukarıda tanımladığım calculate fonksiyonunu çağırarak işlem ne ise onu yaptırıyorum
    firstNumber = calculate();
    // sonra ana ekranımı ve operatör değişkenimi sıfırlıyorum ve sonucu sonuç ekranıma yazdırıyorum
    operator = '';
    secondaryDisplay.innerHTML = firstNumber;
    primaryDisplay.innerHTML = '0';
    isPrevOperator = true;
  }
});
