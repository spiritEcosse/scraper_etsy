import React, { Component } from 'react'
import LoginUser from './Accounts/LoginUser';

class NavComponent extends Component {
    render(){
        let form;
        form = <LoginUser
                handleLoginChange={this.props.handleLoginChange}
                handleLogin={this.props.handleLogin}
                username={this.props.username}/>;
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
                {form}
            </div>
        );
    }
}
export default NavComponent
