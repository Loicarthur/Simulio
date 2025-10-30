import pandas as pd
import numpy as np
import numpy_financial
import datetime


def calculer_simulation(N, C2, T, ASSU, apport, mois, annee, frais_agence, frais_notaire, TRAVAUX, revalorisation_bien):
    """
    Fonction de calcul de simulation immobilière

    Paramètres:
    - N: Durée du prêt (en années)
    - C2: Prix du bien
    - T: Taux d'intérêt (en %)
    - ASSU: Taux d'assurance (en %)
    - apport: Apport personnel
    - mois: Mois d'acquisition
    - annee: Année d'acquisition
    - frais_agence: Frais d'agence (en %)
    - frais_notaire: Frais de notaire (en %)
    - TRAVAUX: Montant des travaux
    - revalorisation_bien: Revalorisation du bien par an (en %)

    Retourne:
    Un dictionnaire avec tous les résultats de la simulation
    """

    CDEPART = C2
    frais_agence2 = (frais_agence / 100) * C2
    frais_notaire_calcule = (frais_notaire / 100) * C2
    C2 = C2 - apport
    garantie_bancaire = (1.5 / 100) * C2

    if garantie_bancaire < 0:
        garantie_bancaire = 0

    if frais_agence2 < 0:
        frais_agence2 = 0

    C2 = C2 + frais_notaire_calcule + garantie_bancaire + frais_agence2 + TRAVAUX
    N2 = N
    N = N * 12
    t = (T / 12)
    q = 1 + t / 100
    M = (q**N * (C2) * (1 - q) / (1 - q**N)) + C2 * ((ASSU / 100) / 12)
    A = C2 * ((ASSU / 100)) * (N / 12)
    I = N * M - C2
    T2 = T * 1 / 100

    date = "{}/01/{}".format(mois, annee)
    rng = pd.date_range(start=date, periods=N, freq='MS')
    rng.name = "Date"
    df = pd.DataFrame(index=rng, columns=['Mensualité', 'Capital Amorti', 'Intérêts', 'Capital restant dû'], dtype='float')
    df.reset_index(inplace=True)
    df.index += 1
    df.index.name = "Mois"

    df["Mensualité"] = -1 * numpy_financial.pmt(T2 / 12, N, C2) + C2 * ((ASSU / 100) / 12)
    df["Capital Amorti"] = -1 * numpy_financial.ppmt(T2 / 12, df.index, N, C2)
    df["Intérêts"] = -1 * numpy_financial.ipmt(T2 / 12, df.index, N, C2)
    df = df.round(2)

    df["Capital restant dû"] = 0
    df.loc[1, "Capital restant dû"] = C2 - df.loc[1, "Capital Amorti"]

    for period in range(2, len(df) + 1):
        previous_balance = df.loc[period - 1, "Capital restant dû"]
        principal_paid = df.loc[period, "Capital Amorti"]

        if previous_balance == 0:
            df.loc[period, ["Mensualité", 'Capital Amorti', "Intérêts", "Capital restant dû"]] == 0
            continue
        elif principal_paid <= previous_balance:
            df.loc[period, "Capital restant dû"] = previous_balance - principal_paid

    df["Date"] = pd.to_datetime(df["Date"], format='%d-%m-%Y')

    salaire_minimum = (M * 100) / 35
    salaire_minimum = int(salaire_minimum)

    if M < 0:
        M = 0

    if salaire_minimum < 0:
        salaire_minimum = 0

    if C2 < 0:
        C2 = 0

    data = {
        "Prix du bien": CDEPART,
        'Frais de notaire': frais_notaire_calcule,
        'Garantie Bancaire': garantie_bancaire,
        "Frais d'agence": frais_agence2,
        "Apport": apport,
        "Total à financer": C2
    }

    output2 = pd.DataFrame([data])

    data2 = {
        "Montant du prêt total": C2,
        "Taux d'intérêt": T,
        "Taux d'assurance": ASSU,
        "Mensualité de crédit": df["Mensualité"].iloc[0],
    }

    output3 = pd.DataFrame([data2])

    date_initiale = datetime.datetime.strptime("{}/01/{}".format(mois, annee), "%d/%m/%Y")
    date_finale = date_initiale.replace(year=date_initiale.year + N2)
    date_finale_str = date_finale.strftime("%d/%m/%Y")

    data3 = {
        "Date d'acquisition": date,
        "Fin du financement": date_finale_str,
    }

    output4 = pd.DataFrame([data3])

    liste_prixdubien = []
    prixDuBien2 = CDEPART
    listeprixdubieninitial = [prixDuBien2]
    for year in range(1, (int((N) / 12) + 1)):
        prixDuBien2 = prixDuBien2 * (1 + (revalorisation_bien / 100))
        liste_prixdubien.append(prixDuBien2)
    listeprixdubieninitial.extend(liste_prixdubien)

    nbreMois = (N) / 12
    nbreMois = int(nbreMois)
    liste_annne = []
    for i in range(0, (nbreMois + 1)):
        a = date_initiale.year + i
        liste_annne.append(a)

    df_somme = pd.DataFrame(
        {
            'Prix du bien': listeprixdubieninitial,
            "Date": liste_annne,
        })

    df["Date"] = pd.to_datetime(df["Date"], format='%d/%m/%Y')
    df['Year'] = df['Date'].dt.year

    products_dict = dict(zip(df.Year, df["Capital restant dû"]))

    df_somme["Capital restant dû"] = df_somme["Date"].map(products_dict)
    df_somme["Capital restant dû"] = df_somme["Capital restant dû"].fillna(0)
    df_somme["Capital restant dû"] = df_somme["Capital restant dû"].replace([float('inf'), -float('inf')], 0)
    df_somme["Somme disponible en cas de revente"] = df_somme["Prix du bien"] - df_somme["Capital restant dû"]
    df_somme.index += 1
    df_somme.index.name = "Periode (Année)"

    df_somme = df_somme.drop(columns="Date", axis=1)
    df_somme["Periode (en années)"] = liste_annne
    df_somme = df_somme.set_index("Periode (en années)")
    output13 = df_somme

    # Convertir les DataFrames en dictionnaires pour JSON
    amortissement_dict = df.to_dict('records')
    financement_dict = output2.to_dict('records')[0]
    credit_dict = output3.to_dict('records')[0]
    revente_dict = output13.to_dict('index')

    return {
        "mensualite": round(M, 2),
        "interets_totaux": round(I, 2),
        "assurance_totale": round(A, 2),
        "frais_notaire": round(frais_notaire_calcule, 2),
        "garantie_bancaire": round(garantie_bancaire, 2),
        "salaire_minimum": salaire_minimum,
        "frais_agence": round(frais_agence2, 2),
        "total_financer": round(C2, 2),
        "travaux": TRAVAUX,
        "amortissement_data": amortissement_dict,
        "financement_data": financement_dict,
        "credit_data": credit_dict,
        "revente_data": revente_dict
    }
