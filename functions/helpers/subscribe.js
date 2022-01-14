const admin = require("firebase-admin");

const { stripeSecretKey, stripePlanID } = require("../config/localKeys");
const stripe = require("stripe")(stripeSecretKey);

const subscribeToPlan = async (req, res) => {
  const { email, payment_method } = req.body;

  admin
    .auth()
    .getUserByEmail(email)
    .then(async (user) => {
      const stripeDoc = await admin
        .firestore()
        .collection("user_subscription")
        .doc(user.uid)
        .get();

      let customer;

      if (stripeDoc.exists && stripeDoc.data().stripe_customer_id) {
        customer = await stripe.customers.update(
          stripeDoc.data().stripe_customer_id,
          {
            payment_method,
          }
        );
      } else
        customer = await stripe.customers.create({
          payment_method,
        });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: stripePlanID }],
      });

      await admin
        .firestore()
        .collection("user_subscription")
        .doc(user.uid)
        .set({
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
        });
    })
    .catch((error) => {
      res.send({ success: false });
    });
};

module.exports = { subscribeToPlan };
