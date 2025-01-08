pragma solidity >=0.5.15;
//SPDX-License-Identifier: Apache 2.0

interface TRC20_Interface {
    function allowance(
        address _owner,
        address _spender
    ) external view returns (uint256);
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);
    function transfer(
        address direccion,
        uint256 cantidad
    ) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
    function decimals() external view returns (uint256);
}

contract THE_MONOPOLY_CLUB {
    TRC20_Interface USDT_Contract;
    TRC20_Interface OTRO_Contract;

    address public tokenUSDT;
    address public tokenOTRO;

    struct User {
        uint256 id;
        address referrer;
        uint256 partnersCount;
        mapping(uint256 => bool) activeX3Levels;
        mapping(uint256 => X3) x3Matrix;
    }

    struct X3 {
        address currentReferrer;
        address[] referrals;
        bool blocked;
        uint256 reinvestCount;
    }

    uint256 public currentStartingLevel = 1;
    uint256 public constant LAST_LEVEL = 15;

    mapping(address => User) public users;
    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public missPayments;

    uint256 public lastUserId = 2;
    address payable public owner;

    mapping(uint256 => uint) public levelPrice;

    event Registration(
        address indexed user,
        address indexed referrer,
        uint256 indexed userId,
        uint256 referrerId
    );
    event Reinvest(
        address indexed user,
        address indexed currentReferrer,
        address indexed caller,
        uint256 matrix,
        uint256 level
    );
    event Upgrade(
        address indexed user,
        address indexed referrer,
        uint256 matrix,
        uint256 level
    );
    event NewUserPlace(
        address indexed user,
        address indexed referrer,
        uint256 matrix,
        uint256 level,
        uint256 place
    );
    event MissedEthReceive(
        address indexed receiver,
        address indexed from,
        uint256 matrix,
        uint256 level
    );
    event SentExtraEthDividends(
        address indexed from,
        address indexed receiver,
        uint256 matrix,
        uint256 level
    );

    constructor(address _tokenUSDT) public {
        (tokenUSDT, tokenOTRO) = (_tokenUSDT, _tokenUSDT);

        (USDT_Contract, OTRO_Contract) = (
            TRC20_Interface(_tokenUSDT),
            TRC20_Interface(_tokenUSDT)
        );

        levelPrice[1] = 20 * 10 ** USDT_Contract.decimals();
        uint256 i;
        for (i = 2; i <= LAST_LEVEL; i++) {
            levelPrice[i] = levelPrice[i - 1] * 2;
        }

        owner = msg.sender;

        User memory user = User({
            id: 1,
            referrer: address(0),
            partnersCount: uint(0)
        });

        users[owner] = user;
        idToAddress[1] = owner;

        for (i = 1; i <= LAST_LEVEL; i++) {
            users[owner].activeX3Levels[i] = true;
        }
    }

    function ChangeLevelPrice(
        uint256 _level,
        uint256 _value
    ) public returns (bool) {
        require(msg.sender == owner);

        levelPrice[_level] = _value * 10 ** USDT_Contract.decimals();

        return true;
    }

    function ChangeTokenUSDT(address _tokenTRC20) public returns (bool) {
        require(msg.sender == owner);

        USDT_Contract = TRC20_Interface(_tokenTRC20);
        tokenUSDT = _tokenTRC20;

        return true;
    }

    function ChangeTokenOTRO(address _tokenTRC20) public returns (bool) {
        require(msg.sender == owner);

        OTRO_Contract = TRC20_Interface(_tokenTRC20);
        tokenOTRO = _tokenTRC20;

        return true;
    }

    function withdrawLostTRXFromBalance() public {
        require(msg.sender == owner, "onlyOwner");
        owner.transfer(address(this).balance);
    }

    function withdrawLostUSDTFromBalance() public {
        require(msg.sender == owner, "onlyOwner");
        USDT_Contract.transfer(owner, USDT_Contract.balanceOf(address(this)));
    }

    function withdrawLostOTROFromBalance() public {
        require(msg.sender == owner, "onlyOwner");
        OTRO_Contract.transfer(owner, OTRO_Contract.balanceOf(address(this)));
    }

    function registrationExt(address referrerAddress, uint256 _value) external {
        require(
            USDT_Contract.balanceOf(msg.sender) >= _value,
            "insuficient balance"
        );
        registration(msg.sender, referrerAddress, _value);
    }

    function buyNewLevel(uint256 level) external {
        require(
            isUserExists(msg.sender),
            "user is not exists. Register first."
        );
        require(
            USDT_Contract.balanceOf(msg.sender) >= levelPrice[level],
            "insuficient balance"
        );
        require(level > 1 && level <= LAST_LEVEL, "invalid level");
        require(
            users[msg.sender].activeX3Levels[level - 1],
            "buy previous level first"
        );
        require(
            !users[msg.sender].activeX3Levels[level],
            "level already activated"
        );

        if (users[msg.sender].x3Matrix[level - 1].blocked) {
            users[msg.sender].x3Matrix[level - 1].blocked = false;
        }

        address freeX3Referrer = findFreeX3Referrer(msg.sender, level);
        users[msg.sender].x3Matrix[level].currentReferrer = freeX3Referrer;
        users[msg.sender].activeX3Levels[level] = true;
        updateX3Referrer(msg.sender, freeX3Referrer, level);

        emit Upgrade(msg.sender, freeX3Referrer, 1, level);
    }

    function registration(
        address userAddress,
        address referrerAddress,
        uint256 _value
    ) private {
        require(
            USDT_Contract.balanceOf(msg.sender) >= _value,
            "insuficient balance"
        );
        require(!isUserExists(userAddress), "user exists");
        require(isUserExists(referrerAddress), "referrer not exists");

        uint32 size;
        assembly {
            size := extcodesize(userAddress)
        }
        require(size == 0, "cannot be a contract");

        require(
            _value == levelPrice[currentStartingLevel],
            "invalid registration cost"
        );

        User memory user = User({
            id: lastUserId,
            referrer: referrerAddress,
            partnersCount: 0
        });

        users[userAddress] = user;
        idToAddress[lastUserId] = userAddress;

        users[userAddress].referrer = referrerAddress;

        users[userAddress].activeX3Levels[1] = true;

        lastUserId++;

        users[referrerAddress].partnersCount++;

        address freeX3Referrer = findFreeX3Referrer(userAddress, 1);
        users[userAddress].x3Matrix[1].currentReferrer = freeX3Referrer;
        updateX3Referrer(userAddress, freeX3Referrer, 1);

        emit Registration(
            userAddress,
            referrerAddress,
            users[userAddress].id,
            users[referrerAddress].id
        );
    }

    function updateX3Referrer(
        address userAddress,
        address referrerAddress,
        uint256 level
    ) private {
        users[referrerAddress].x3Matrix[level].referrals.push(userAddress);

        if (users[referrerAddress].x3Matrix[level].referrals.length < 3) {
            emit NewUserPlace(
                userAddress,
                referrerAddress,
                1,
                level,
                uint8(users[referrerAddress].x3Matrix[level].referrals.length)
            );
            return sendETHDividends(referrerAddress, userAddress, 1, level);
        }

        emit NewUserPlace(userAddress, referrerAddress, 1, level, 3);
        //close matrix
        users[referrerAddress].x3Matrix[level].referrals = new address[](0);
        if (
            !users[referrerAddress].activeX3Levels[level + 1] &&
            level != LAST_LEVEL
        ) {
            users[referrerAddress].x3Matrix[level].blocked = true;
        }

        //create new one by recursion
        if (referrerAddress != owner) {
            //check referrer active level
            address freeReferrerAddress = findFreeX3Referrer(
                referrerAddress,
                level
            );
            if (
                users[referrerAddress].x3Matrix[level].currentReferrer !=
                freeReferrerAddress
            ) {
                users[referrerAddress]
                    .x3Matrix[level]
                    .currentReferrer = freeReferrerAddress;
            }

            users[referrerAddress].x3Matrix[level].reinvestCount++;
            emit Reinvest(
                referrerAddress,
                freeReferrerAddress,
                userAddress,
                1,
                level
            );
            updateX3Referrer(referrerAddress, freeReferrerAddress, level);
        } else {
            sendETHDividends(owner, userAddress, 1, level);
            users[owner].x3Matrix[level].reinvestCount++;
            emit Reinvest(owner, address(0), userAddress, 1, level);
        }
    }

    function findFreeX3Referrer(
        address userAddress,
        uint256 level
    ) public returns (address) {
        uint256 first = 0;
        while (true) {
            first++;
            if (users[users[userAddress].referrer].activeX3Levels[level]) {
                // mising paiments pagos perdidos solo 1 nivel de profundidad
                return users[userAddress].referrer;
            } else {
                if (first == 1) {
                    missPayments[users[userAddress].referrer] = levelPrice[
                        level
                    ];
                }
            }

            userAddress = users[userAddress].referrer;
        }
    }

    function usersActiveX3Levels(
        address userAddress,
        uint256 level
    ) public view returns (bool) {
        return users[userAddress].activeX3Levels[level];
    }

    function usersX3Matrix(
        address userAddress,
        uint256 level
    ) public view returns (address, address[] memory, bool, uint) {
        return (
            users[userAddress].x3Matrix[level].currentReferrer,
            users[userAddress].x3Matrix[level].referrals,
            users[userAddress].x3Matrix[level].blocked,
            users[userAddress].x3Matrix[level].reinvestCount
        );
    }

    function isUserExists(address user) public view returns (bool) {
        return (users[user].id != 0);
    }

    function findEthReceiver(
        address userAddress,
        address _from,
        uint256 matrix,
        uint256 level
    ) private returns (address, bool) {
        address receiver = userAddress;
        bool isExtraDividends;
        if (matrix == 1) {
            while (true) {
                if (users[receiver].x3Matrix[level].blocked) {
                    emit MissedEthReceive(receiver, _from, 1, level);
                    isExtraDividends = true;
                    receiver = users[receiver].x3Matrix[level].currentReferrer;
                } else {
                    return (receiver, isExtraDividends);
                }
            }
        } else {
            while (true) {
                return (receiver, isExtraDividends);
            }
        }
    }

    function sendETHDividends(
        address userAddress,
        address _from,
        uint256 matrix,
        uint256 level
    ) private {
        (address receiver, bool isExtraDividends) = findEthReceiver(
            userAddress,
            _from,
            matrix,
            level
        );

        if (
            !USDT_Contract.transferFrom(
                msg.sender,
                address(uint160(receiver)),
                levelPrice[level]
            )
        ) {
            USDT_Contract.transfer(
                address(uint160(owner)),
                USDT_Contract.balanceOf(address(this))
            );
            return;
        }

        if (isExtraDividends) {
            emit SentExtraEthDividends(_from, receiver, matrix, level);
        }
    }

    function bytesToAddress(
        bytes memory bys
    ) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys, 20))
        }
    }
}
