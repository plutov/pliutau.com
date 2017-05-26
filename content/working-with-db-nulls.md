+++
date = "2016-04-07T09:17:49+07:00"
title = "Working with DB nulls in Golang"
tags = [ "Go", "DB" ]
type = "post"
+++

This post shows how to marshall NULL values from the database into Go struct and how to avoid mistakes during fetching optional values with SELECT query. I'll show standard types sql.NullString, sql.NullInt64, etc types.


#### Customer table example

Customer table has mandatory ID and Email fields and optional Phone(string)/Age(int). I will show you a basic code how to fetch Customer by Email, marshall data into Go struct.
```
type Customer struct {
	ID    int
	Email string
	Phone string // optional
	Age   int    // optional
}

func GetCustomerByEmail(db *sql.DB, email string) (*Customer, error) {
	customer := new(Customer)

	stmt, err := db.Prepare("SELECT id, email, phone, age FROM customer where email = ?")
	if err != nil {
		return nil, err
	}

	defer stmt.Close()

	err = stmt.QueryRow(email).Scan(&customer.ID, &customer.Email, &customer.Phone, &customer.Age)
	if err != nil {
		return nil, err
	}

	return customer, nil
}
```

#### Error

Now let's imagine that our Customer has an empty Phone (NULL in the DB), in this case SQL driver will fail to marshall DB NULL into string with the following error:
```
sql: Scan error on column index 1: unsupported driver -> Scan pair: <nil> -> *string
```

When you skip this error you will have incorrect data in Customer object, for example if Age is not NULL it will be marshalled into Phone field.

#### sql.NullString, sql.NullInt64, sql.NullFloat64, sql.NullBool

Standard sql package has [4 types](https://golang.org/pkg/database/sql/#NullString) for nullable data. With this only one change below error will be solved:
```
type Customer struct {
	ID    int
	Email string
	Phone sql.NullString
	Age   sql.NullInt64
}
```

#### Retrieve value from sql.NullString

The sql.Null[String,Int64,Float64,Bool] types have two fields: a typed value and a boolean Valid. You can use the typed value to get either the value that's been set, or the type's "zero value" if it hasn't been set. You can get customer's phone number with the following code now:
```
fmt.Println(customer.Phone.Value)
```
