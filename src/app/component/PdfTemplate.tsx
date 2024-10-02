/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { dateFormatter } from '@/utils/data_types';

import RobotoBold from '../../../public/Roboto/Roboto-Bold.ttf';
import RobotoLight from '../../../public/Roboto/Roboto-Light.ttf';
// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: RobotoBold, fontWeight: 700 },
    { src: RobotoLight, fontWeight: 300 },
  ],
});


interface EmailTemplateProps {
  $id: string;
  customer_id: string;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  date: string;
  valid_until: string;
  quote: string;
  description_of_work: string;
  items_description: string[];
  items_quantity: number[];
  items_unit: number[];
  items_amount: number[];
  currentUser: {
    email: string;
    phone: string;
    name: string;
  };
}

// Create Document Component
export default function PdfTemplate({
  $id,
  customer_id,
  name,
  phone_number,
  email,
  address,
  date,
  valid_until,
  quote,
  description_of_work,
  items_description,
  items_quantity,
  items_unit,
  items_amount,
  currentUser,
}: EmailTemplateProps) {
  const currentYear = new Date().getFullYear();
  const totalAmount = items_amount.reduce((total, amount) => total + amount, 0).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              src="https://res.cloudinary.com/df3swmzfp/image/upload/v1724208099/Logo_ns59li.png"
            />
            <Text style={styles.h1}>MEEK ELITE CLEANING SERVICES</Text>
          </View>

          <View style={styles.row}>
            <View style={{ width: "60%"}}>
              <Text style={styles.resetText}>F.C.T ABUJA</Text>
              <Text style={styles.resetText}>{currentUser?.phone}</Text>
              <Text style={styles.resetText}>meekelitecleaningservices@gmail.com</Text>
            </View>
            <View style={{ textAlign: "right", width: "40%"}}>
              <Text style={styles.h2}>QUOTATION</Text>
              <View style={{...styles.quoteHead, flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={styles.quotationHead}>QUOTE</Text>
                <Text style={styles.quotationHead}>DATE</Text>
              </View>
              <View style={{...styles.quoteHead, flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={styles.quoteText}>{quote}</Text>
                <Text style={styles.quoteText}>{dateFormatter(date)}</Text>
              </View>
              <View style={{...styles.quoteHead, flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={styles.quotationHead}>CUSTOMER ID</Text>
                <Text style={styles.quotationHead}>VALID UNTIL</Text>
              </View>
              <View style={{...styles.quoteHead, flexDirection: "row", justifyContent: "flex-end"}}>
                <Text style={styles.quoteText}>{customer_id}</Text>
                <Text style={styles.quoteText}>{dateFormatter(valid_until)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.textHeader}>COMPANY/NAME</Text>
            <View>
              <Text style={styles.resetText}>{name}</Text>
              <Text style={styles.resetText}>{address}</Text>
              <Text style={styles.resetText}>{phone_number}</Text>
            </View>
          </View>

          <View>
            <Text style={{...styles.textHeader, width: "100%", textAlign: "left", paddingLeft: "10px"}}>DESCRIPTION OF WORK</Text>
          </View>

          <View style={styles.borderStyle}>
            <Text style={styles.productDescription}>{description_of_work}</Text>
          </View>

          <View>
            <View style={{...styles.textHeader, width: "100%", flexDirection: "row", justifyContent: "space-between", padding: "3px 10px"}}>
              <Text >ITEM</Text>
              <Text >QTY</Text>
              <Text >UNIT PRICE</Text>
              <Text >AMOUNT</Text>
            </View>
            <View style={styles.borderStyle}>
              {items_description.map((desc, index) => (
                <View key={index} style={{...styles.header, width: "100%", flexDirection: "row", justifyContent: "space-between", padding: "3px"}}>
                  <Text style={{...styles.productDescription, width: "40%"}}>{desc}</Text>
                  <Text style={{...styles.productDescription, width: "40%"}}>{items_quantity[index]}</Text>
                  <Text style={{...styles.productDescription, width: "35%"}}>{items_unit[index]}</Text>
                  <Text style={{...styles.productDescription, width: "25%", textAlign: "right"}}>{items_amount[index].toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.section}>
                <View style={{...styles.header, width: "100%", flexDirection: "row", justifyContent: "space-between", border: "2px solid #e5e5e5", padding: "1%"}}>
                  <Text style={styles.productPriceLarge}>TOTAL</Text>
                  <Text style={styles.productPriceLarge}>₦{totalAmount}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.textHeader}>TERMS AND CONDITION</Text>
          </View>

          <View style={styles.section}>
            <Text style={{...styles.resetText, fontWeight: "bold"}}>This quote is valid for 10 Days.</Text>
            <Text style={{...styles.resetText, fontWeight: "bold"}}>Additional charges may apply.</Text>
            <Text style={{...styles.resetText, fontWeight: "bold"}}>Deposit 50% payment on acceptance of this quote</Text>
          </View>

          <View style={styles.section}>
            <View style={{...styles.header, width: "100%", flexDirection: "row", justifyContent: "space-between", padding: "3px", border: "2px solid #e5e5e5"}}>
              <Text style={{...styles.resetText, fontWeight: "bold"}}>Quotation prepared by:</Text>
              <Text style={{...styles.resetText, fontWeight: "bold"}}>{currentUser?.name}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{...styles.header, width: "100%", flexDirection: "row", justifyContent: "space-between", padding: "3px", border: "2px solid #e5e5e5"}}>
              <Text style={{...styles.resetText, fontWeight: "bold"}}>Quotation accepted by:</Text>
              <Text style={{...styles.resetText, fontWeight: "bold"}}></Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.footerText}>
              If you have any questions, please feel free to contact us. We look forward to working with you!
            </Text>
            <Text style={styles.footerText}>
              Sincerely,
              <br />
              MeekElite Cleaning Services Team
            </Text>
          </View>

          <View style={{...styles.section,  width: "100%", flexDirection: "row", justifyContent: "center"}}>
            <Image
              style={{ width: 66, height: 66 }}
              src="https://res.cloudinary.com/df3swmzfp/image/upload/v1724208099/Logo_ns59li.png"
            />
          </View>

          <Text style={styles.footerCopyright}>
            Copyright © {currentYear} MeekElite Cleaning Services. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// Create styles
const repeatedStyles = {
  borderSpacing: "0px",
  color: "#ffff",
  backgroundColor: "#019CDE",
  borderRadius: "3px",
  fontSize: "10px",
  fontFamily: 'Roboto',
  padding: "3px 0"
}

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "#ffff",
  backgroundColor: "#019CDE",
  borderRadius: "3px",
  fontSize: "13px",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
  },
  container: {
    padding: 10,
    width: '100%',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1
  },
  logo: {
    width: 100,
    height: 100,
  },
  h1: {
    color: "#019CDE",
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  h2: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  resetText: {
    margin: 5,
    padding: 0,
    fontSize: "10px",
  },
  quoteHead: {
    textAlign: 'center'
  },
  borderStyle: {
    borderBottom: "2px solid #e5e5e5", 
    borderLeft: "2px solid #e5e5e5", 
    borderRight: "2px solid #e5e5e5", 
    marginBottom: "5%", 
    padding: "1%"
  },
  quotationHead: {
    ...repeatedStyles,
    margin: "0 2%",
    width: "90%",
    textAlign: "center",
    fontWeight:"bold"
  },
  productTitleTable: {
    ...informationTable,
    margin: "0",
    height: "24px",
  },
  quotationSubHead: {
    textAlign: "center",
    padding: "0",
    width: "30%"
  },
  quoteText: {
    textAlign: "center",
    fontSize: "10px",
    color: "#000",
    margin: "2%",
    width: "90%",
  },
  textHeader: {
    ...repeatedStyles,
    width: "20%", 
    textAlign: "center",
    fontWeight:"bold"
  },
  productTitle: {
    backgroundColor: '#019CDE',
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
  },
  productDescription: {
    fontSize: "10px",
    color: '#000',
    margin: 5,
    padding: 0,
  },
  productPriceLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#019CDE',
    margin: '0 0 0 10px',
    padding: 0,
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.4,
    marginTop: 20,
  },
  footerCopyright: {
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
    marginTop: 20,
  },
});