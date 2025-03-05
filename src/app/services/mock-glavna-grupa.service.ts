import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Grupa {
  name: string;
}

export interface Nadgrupa {
  name: string;
  grupe: string[];
}

export interface GlavnaGrupa {
  name: string;
  nadgrupe: Record<string, string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class MockGlavnaGrupaService {
  private allGlavneGrupe: GlavnaGrupa[] = [];

  constructor() {
    // Postavljamo hardkodovane podatke
    this.allGlavneGrupe= this.getHardcodedData();
  }

  getAllGlavneGrupe(): GlavnaGrupa[] {
    return this.allGlavneGrupe;
  }

  private getHardcodedData(): GlavnaGrupa[] {
    return [
      {
        "name": "BATERIJE, PUNJAČI I KABLOVI",
        "nadgrupe": {
          "KABLOVI I ADAPTERI": [
            "ADAPTERI",
            " AUDIO KABLOVI",
            " PCI ADAPTERI",
            " PCMCIA KARTICE",
            " SPLITERI",
            " USB ADAPTERI",
            " USB HUBOVI",
            " USB KABLOVI",
            " VIDEO KABLOVI"
          ],
          "PC KABLOVI": [
            "ATA i SATA kablovi",
            " Kablovi za napajanje"
          ],
          "KABLOVI": [
            "Kablovi 5e",
            " Kablovi 6e",
            " Kablovi 7e",
            " Patch kablovi 5e",
            " Patch kablovi 6e",
            " Telefonski kablovi"
          ],
          "ADAPTERI": [
            "Audio adapteri",
            " Video adapteri"
          ],
          "BATERIJE I PUNJAČI": [
            "Baterije za UPS-ove",
            " Baterijske lampe",
            " Electronics",
            " Nepunjive baterije",
            " Punjači za baterije",
            " Punjive baterije"
          ],
          "PCI ADAPTERI": [
            "RS 232 Adapteri",
            " USB Adapteri"
          ]
        }
      },
      {
        "name": "RAČUNARI, KOMPONENTE I GAMING",
        "nadgrupe": {
          "DESKTOP RAČUNARI": [
            "Desktop računari bez OS",
            " Desktop računari sa OS"
          ],
          "HDD Rack": [
            "2",
            "5 inch",
            " Docking"
          ],
          "MEMORIJE": [
            "Desktop memorije",
            " Laptop memorije"
          ],
          "Čitači kartica": [
            "Biometrijski",
            " Eksterni"
          ],
          "REKOVI I OPREMA": [
            "Nosači",
            " Oprema za rek",
            " Ormani",
            " Paneli"
          ],
          "LAPTOP I TABLET RAČUNARI": [
            "LAPTOPOVI",
            " OPREMA ZA LAPTOPOVE",
            " OPREMA ZA TABLETE",
            " TABLET RAČUNARI"
          ],
          "OPTIČKI UREĐAJI": [
            "DVD+-RW SATA",
            " Externi DVD+-RW"
          ],
          "SERVERI": [
            "Dodatna oprema za servere"
          ],
          "SOFTWARE": [
            "Antivirus",
            " Aplikacije",
            " Microsoft"
          ],
          "GRAFIČKE KARTE": [
            "AMD grafičke karte",
            " nVidia grafičke karte"
          ],
          "GAMING": [
            "GAMEPAD / JOYSTICK",
            " GAMING KOMPLETI",
            " GAMING MIŠEVI",
            " GAMING NAMEŠTAJ",
            " GAMING PODLOGE",
            " GAMING SLUŠALICE",
            " GAMING TASTATURE",
            " IGRICE",
            " OPREMA ZA KONZOLE",
            " OSTALA GAMING OPREMA",
            " VOLANI"
          ],
          "FIBER": [
            "Kablovi",
            " Moduli/Adapteri",
            " Paneli",
            " Patch kablovi/Pigtailovi"
          ],
          "PC KOZMETIKA": [
            "PRIBOR ZA ČIŠĆENJE"
          ],
          "WIRELESS": [
            "Access Point",
            " Antene",
            " Mrežne kartice",
            " Ruteri"
          ],
          "PROCESORI": [
            "Procesori AMD",
            " Procesori Intel"
          ],
          "RAČUNARI": [
            "ALL-IN-ONE RAČUNARI",
            " BRAND-NAME RAČUNARI",
            " SERVERI"
          ],
          "RAČUNARSKE PERIFERIJE": [
            "BLUETOOTH ADAPTERI",
            " DODATNA OPREMA ZA MONITORE",
            " GRAFIČKE TABLE",
            " MIŠEVI",
            " MONITORI",
            " PC KOZMETIKA",
            " PODLOGE",
            " TASTATURE",
            " UPS I ISPRAVLJAČI",
            " USB FLASH I HDD",
            " WEB KAMERE",
            " ZAŠTITNI KABLOVI"
          ],
          "Microsoft": [
            "Aplikacije",
            " Operativni sistemi"
          ],
          "RAČUNARSKE KOMPONENTE": [
            "HARD DISKOVI",
            " KUĆIŠTA",
            " MEMORIJE",
            " NAPAJANJA"
          ],
          "HARD DISKOVI": [
            "HDD 2.5",
            " HDD 3.5",
            " M.2",
            " SSD"
          ],
          "TASTATURE": [
            "Desktop kompleti",
            " Tastature"
          ]
        }
      },
      {
        "name": "FITNESS I SPORT",
        "nadgrupe": {
          "BICIKLE I FITNES": [
            "BICIKLE ZA DECU",
            " BICIKLE ZA ODRASLE",
            " OPREMA ZA BICIKLE",
            " OSTALA FITNES OPREMA",
            " SOBNE BICIKLE",
            " TRAKE ZA TRČANJE"
          ],
          "NEGA LICA I TELA": [
            "Aparati za brijanje",
            " Epilatori",
            " Fenovi",
            " Masažeri / Nega lica",
            " Nega kose",
            " Setovi za manikir",
            " Telesne vage",
            " Trimer"
          ]
        }
      },
      {
        "name": "BELA TEHNIKA I KUĆNI APARATI",
        "nadgrupe": {
          "HLADNJACI": [
            "Hladnjaci za kućišta",
            " Hladnjaci za procesore",
            " Termalne paste"
          ],
          "KUĆNA BELA TEHNIKA": [
            "Aspiratori",
            " Bojleri",
            " Električni šporeti",
            " Frižideri",
            " Kombinovani šporeti",
            " Mašine za pranje sudova",
            " Mašine za pranje veša",
            " Mašine za sušenje veša",
            " Oprema za belu tehniku",
            " Pranje i sušenje veša",
            " Šporeti na čvrsta goriva",
            " Ugradne ploče",
            " Ugradne rerne",
            " Ugradni setovi",
            " Zamrzivači"
          ],
          "BELA TEHNIKA": [
            "GREJANJE",
            " KLIMA UREĐAJI",
            " Razno"
          ],
          "GREJANJE": [
            "Grejalice",
            " Peći na čvrsta goriva",
            " Radijatori"
          ],
          "MALI KUĆNI APARATI": [
            "Aparati za kafu",
            " Aparati za kuvanje na paru",
            " Dispanzeri za vodu",
            " Dodatna oprema za usisivače",
            " Friteze",
            " Indukcione ploče / rešoi",
            " Ketleri - Grejači vode",
            " Kontaktni gril / aparati za sendviče / roštilj",
            " Kuhinjske vage",
            " Mali kućni aparati ostalo",
            " Mali kuhinjski aparati ostalo",
            " Mašine za mlevenje mesa",
            " Mesoreznice",
            " Mikrotalasne rerne",
            " Mikseri",
            " Multipraktici i kuhinjski roboti",
            " Pegle",
            " Posuđe i kuhinjska oprema",
            " Seckalice",
            " Sokovnici",
            " Toster",
            " Usisivači",
            " Ventilatori / Osveživači / Ovlaživači"
          ]
        }
      },
      {
        "name": "ALATI I OPREMA ZA DOM",
        "nadgrupe": {
          "ALAT I BAŠTA": [
            "ALATI",
            " BAZENI"
          ],
          "BAŠTA": [
            "Bašta ostalo",
            " Baštenski nameštaj",
            " Baštenski trimeri",
            " Kosačice",
            " Perači pod pritiskom"
          ],
          "LED RASVETA": [
            "LED REFLEKTORI"
          ],
          "SVE ZA KUĆU": [
            "DASKE ZA PEGLANJE",
            " HIGIJENA",
            " ZAŠTITA I DEZINFEKCIJA",
            " KOFE",
            " KANTE",
            " MOPOVI",
            " METLE",
            " LED RASVETA",
            " OSTALO"
          ]
        }
      },
      {
        "name": "TELEFONI, TABLETI I OPREMA",
        "nadgrupe": {
          "OPREMA ZA MOBILNE TELEFONE": [
            "Handsfree slušalice za mobilne telefone",
            " Kućni punjači",
            " Power Bank",
            " Punjači za auto",
            " Torbice",
            " maskice i privesci"
          ],
          "OPREMA ZA TABLETE": [
            "Auto držači",
            " Futrole i torbe",
            " Tastature za tablete"
          ],
          "MEMORIJSKE KARTICE I ČITAČI": [
            "Čitači kartica",
            " Memorijske kartice"
          ],
          "USB FLASH I HDD": [
            "Eksterni HDD i SSD",
            " HDD Rack",
            " USB Flash"
          ],
          "MREŽNA OPREMA": [
            "FIBER",
            " KABLOVI",
            " KVM SVIČEVI",
            " LAN ruteri",
            " NAS",
            " REKOVI I OPREMA",
            " SVIČEVI",
            " WIRELESS"
          ],
          "MOBILNI I FIKSNI TELEFONI": [
            "FIKSNI TELEFONI",
            " MOBILNI TELEFONI",
            " SMART MOBILNI TELEFONI",
            " SMARTWATCH"
          ],
          "USB ADAPTERI": [
            "Razno",
            " USB - IDE/SATA",
            " USB - LAN",
            " USB - RS232"
          ],
          "USB KABLOVI": [
            "USB Mini",
            " USB produžni",
            " USB za štampač",
            " USB za telefon"
          ],
          "OPREMA ZA LAPTOPOVE": [
            "Postolja i hladnjaci",
            " Punjači i pretvarači",
            " Torbe i rančevi"
          ],
          "OPREMA ZA TV": [
            "Antene za TV",
            " Daljinski upravljači",
            " Digitalni risiveri",
            " DVD uređaji",
            " Nosači za TV",
            " Smart TV box"
          ],
          "FIKSNI TELEFONI": [
            "Bežični telefoni",
            " IP telefoni",
            " Stoni telefoni"
          ]
        }
      },
      {
        "name": "SIGURNOSNI I ALARMNI SISTEMI",
        "nadgrupe": {
          "KONEKTORI I MODULI": [
            "Konektori",
            " Moduli"
          ],
          "VIDEO NADZOR I  SIGURNOSNA OPREMA": [
            "ALARMNI SISTEM PARADOX",
            " KUĆNA ZVONA",
            " OPREMA ZA VIDEO NADZOR"
          ],
          "OPREMA ZA VIDEO NADZOR": [
            "Kablovi",
            " Konektori",
            " Napajanja",
            " Nosači i kućišta",
            " Ostalo"
          ],
          "ALARMNI SISTEM ELDES": [
            "Ostalo"
          ],
          "ALARMNI SISTEMI": [
            "Razno"
          ],
          "ALARMNI SISTEM PARADOX": [
            "Kablovi",
            " Ostalo",
            " Senzori",
            " Šifratori",
            " Sirene",
            " Transformatori"
          ]
        }
      },
      {
        "name": "TV, FOTO, AUDIO I VIDEO",
        "nadgrupe": {
          "FOTOAPARATI I KAMERE": [
            "AKCIONE KAMERE I OPREMA",
            " AUTO KAMERE",
            " DIGITALNI FOTOAPARATI"
          ],
          "DIGITALNI SNIMAČI": [
            "Digitalni Video Snimači HD-TVI",
            " Digitalni Video Snimači IP NVR"
          ],
          "KAMERE": [
            "Kamere HD-TVI",
            " Kamere IP"
          ],
          "ZVUČNICI": [
            "Bluetooth zvučnici",
            " Sistem 2.1",
            " Sistem 5.1",
            " USB zvučnici",
            " Zvučnici za računar"
          ],
          "AUDIO, HI-FI": [
            "Auto radio",
            " Diktafoni",
            " FM prijemnici",
            " FM Transmiteri",
            " MP3 i MP4 plejeri",
            " Muzičke linije",
            " Pojačala",
            " risiveri",
            " Soundbar",
            " Zvučnici za auto"
          ],
          "PROJEKTORI I OPREMA": [
            "Oprema za projektore",
            " Projektori"
          ],
          "SLUŠALICE I MIKROFONI": [
            "Bežične slušalice",
            " Mikrofoni",
            " Slušalice",
            " Slušalice bubice"
          ],
          "TV, AUDIO, VIDEO": [
            "INTERAKTIVNI DISPLAY",
            " OPREMA ZA TV",
            " TELEVIZORI"
          ]
        }
      },
      {
        "name": "KANCELARIJSKI I ŠKOLSKI MATERIJAL",
        "nadgrupe": {
          "KANCELARIJSKI MATERIJAL": [
            "CD",
            " DVD MEDIJI",
            " KASE",
            " SEFOVI I BROJAČI NOVCA",
            " OPREMA ZA KANCELARIJE",
            " PAPIRI"
          ],
          "ŠKOLSKI PRIBOR": [
            "LEPKOVI",
            " PRIBOR ZA PISANJE"
          ],
          "CD, DVD MEDIJI": [
            "Diskovi",
            " DVD diskovi",
            " Kutije za diskove"
          ]
        }
      },
      {
        "name": "OSTALO I OUTLET",
        "nadgrupe": {
          "OUTLET": [
            "OUTLET LAPTOP I TABLET RAČUNARI",
            " OUTLET RAČUNARI",
            " OUTLET RAČUNARSKE KOMPONENTE"
          ],
          "RAZNO": [
            "Razno"
          ]
        }
      }
    ];
  }
}
