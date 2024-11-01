import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import { getAllUsers, createNewUserService, deleteUserService } from '../../services/userService'
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModal: false,
        };
    }

    // Hàm chạy khi khởi tạo một component
    async componentDidMount() {
        await this.getAllUsersFromReact();

    }
    getAllUsersFromReact = async () => { // lấy tất cả user bằng cách dùng axois gọi api 
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) // không lỗi, lấy được dữ liệu từ API 
        {
            this.setState({
                arrUsers: response.users,
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModal: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
        })
    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModal: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA', {}) // truyền dữ 1 event và dữ liệu  
            }
        } catch (error) {
            console.log(error);
        }
    }

    handelDeleteUser = async (user) => {
        // Muốn thêm hay sửa, xóa thì phải vào service viết function để gọi tới API thêm, sửa xóa bên server
        try {
            let response = await deleteUserService(user.id);
            if (response && response.errCode === 0) {
                this.getAllUsersFromReact();
            } else {
                alert(response.errMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }



    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModal}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                <div className="title text-center">Manage User</div>
                <div className="mx-1">
                    <button
                        className="btn btn-primary px-3"
                        onClick={this.handleAddNewUser}
                    >
                        <i className="fa-solid fa-plus px-2"></i>
                        Add new User
                    </button>
                </div>
                <div className="users-table mt-4 mx-1">
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>FirstName</th>
                                <th>Lastname</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrUsers && arrUsers.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{user.email}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.address}</td>
                                            <td>
                                                <button className="btn-edit"

                                                ><i className="fa-solid fa-pencil"></i></button>
                                                <button className="btn-delete"
                                                    onClick={() => this.handelDeleteUser(user)}
                                                ><i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
