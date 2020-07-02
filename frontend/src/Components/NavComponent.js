import React, { Component } from 'react'
import LoginUser from './Accounts/LoginUser';
import { Alert } from '@material-ui/lab';


class NavComponent extends Component {
    // const [open, setOpen] = React.useState(true);
    render(){
        let form = <LoginUser/>;
        const logged_in_nav = (
            <a onClick = {() => this.props.display_form('login')}>Login</a>
        );
        const logged_out_nav = (
            <ul>
                <li onClick={this.props.handleLogout}>Logout</li>
            </ul>
        );
        return (
            <div>
                {this.props.logged_in? logged_out_nav : ""}
                { form }
            </div>
        );
    }
}
export default NavComponent
