import React from 'react';
import { toast } from 'react-toastify';

class UpdateSubscription extends React.Component {
  constructor(props) {
    super(props);
    const { prevSubscription } = props;

    this.state = {
      name: prevSubscription.name || '', 
      nickname: prevSubscription.nickname || '', 
      dueDate: prevSubscription.dueDate || '',
      reminderDays: prevSubscription.reminderDays || 0,
      amount: prevSubscription.amount || 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  async handleSubscriptions() {
    const { updateSubscription } = this.props;

    const newSubscriptionList = await fetch(`${window.location.pathname}/subscriptions`);
    
    const { status } = newSubscriptionList;
    const response = await newSubscriptionList.json();
    if (status === 400) {
      toast.error('Error: Error fetching your updated subscription!');
      return;
    }

    updateSubscription(response);
    toast.success('Successfully updated your subscription!');
  }

  handleChange(event, key) {
    const { value } = event.target;
    event.preventDefault();

    this.setState({ [key]: value });
  }

  async handleSubmit(event) {
    const { prevSubscription } = this.props;
    const updatedSubscriptionForm = this.state;
    event.preventDefault();

    updatedSubscriptionForm.subscriptionUuid = prevSubscription.subscriptionUuid;

    const updatedSubscription = await fetch(`${window.location.pathname}/subscriptions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSubscriptionForm)
    });

    const { status } = updatedSubscription;
    if (status === 400 ) {
      toast.error('Error: Error while updating subscription! Try again!');
      return;
    };

    this.handleSubscriptions();
  }

  render() {
    const { name, nickname, dueDate, reminderDays, amount } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
          <label htmlFor="subscription-name">
            Name:
            <input type="text" name="subscription-name" value={name} onChange={(event) => this.handleChange(event, 'name')}  />
          </label>

          <label htmlFor="subscription-nickname">
            Nickname:
            <input type="text" name="subscription-nickname" value={nickname} onChange={(event) => this.handleChange(event, 'nickname')}  /> 
          </label>

          <label htmlFor="subscription-due-date">
            Due Date: 
            <input type="date" name="subscription-due-date" value={dueDate} onChange={(event) => this.handleChange(event, 'dueDate')} />
          </label>

          <label htmlFor="subscription-reminder-days">
            Reminder Days: 
            <input type="number" name="subscription-reminder-days" value={reminderDays} onChange={(event) => this.handleChange(event, 'reminderDays')} />
          </label>

          <label htmlFor="subscription-amount">
            Amount: 
            <input type="number" name="subscription-amount" step="0.01" value={amount} onChange={(event) => this.handleChange(event, 'amount')} />
          </label>

          <input type="submit" value="Submit" />
        </form>
    );
  }
};

export default UpdateSubscription;