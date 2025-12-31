"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import Header from "@/components/company/Header";

interface ICartCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    coverImage: string;
    price: number;
  };
  accessType: "seats" | "unlimited";
  seats: number;
  price: number;
}

export default function CompanyCart() {
  const [cartCourses, setCartCourses] = useState<ICartCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [customSeats, setCustomSeats] = useState<{ [key: string]: number }>({});
  const [showCustomInput, setShowCustomInput] = useState<{ [key: string]: boolean }>({});

  const fetchCart = async () => {
    try {
      const { data } = await companyApiMethods.getCart();
      setCartCourses(data.courses);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSeatUpdate = async (courseId: string, seats: number) => {
    if (!seats) return;

    if (seats < 1) seats = 1;
    if (seats > 100) seats = 100;

    await companyApiMethods.updateSeat(courseId, seats);
    setShowCustomInput({ ...showCustomInput, [courseId]: false });
    setCustomSeats({ ...customSeats, [courseId]: 0 });
    fetchCart();
  };

  const handleSelectChange = (courseId: string, value: string) => {
    if (value === "custom") {
      setShowCustomInput({ ...showCustomInput, [courseId]: true });
      setCustomSeats({ ...customSeats, [courseId]: 1 });
    } else {
      setShowCustomInput({ ...showCustomInput, [courseId]: false });
      handleSeatUpdate(courseId, Number(value));
    }
  };

  const applyCustomSeats = (courseId: string) => {
    const seats = customSeats[courseId] || 1;
    handleSeatUpdate(courseId, seats);
  };

  const removeCourse = async (id: string) => {
    await companyApiMethods.removeFromCart(id);
    fetchCart();
  };

  const calculateTotal = () => {
    return cartCourses.reduce((sum, item) => sum + item.price, 0);
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <>
      <Header />
      <div className="px-4 py-6 sm:px-6 lg:px-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Your Cart
        </h1>

        {cartCourses.length === 0 ? (
          <div className="text-center p-8 sm:p-16 bg-gray-100 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              No courses in cart
            </h2>
            <Link href="/company/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {cartCourses.map((item) => (
              <div
                key={item._id}
                className="
            border rounded-lg p-4
            flex flex-col gap-4
            md:flex-row md:items-center md:justify-between
          "
              >
                {/* LEFT */}
                <div className="flex gap-4">
                  <Image
                    src={item.courseId.coverImage}
                    alt="thumbnail"
                    width={80}
                    height={60}
                    className="rounded shrink-0"
                  />

                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-semibold">
                      {item.courseId.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.courseId.price}
                    </p>
                   
                    <p className="text-sm text-gray-600">
                      Seats: {item.seats}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="
            flex flex-col gap-3
            sm:flex-row sm:items-center
          ">
                  {item.accessType === "seats" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="border rounded p-2 min-w-[120px]"
                        value={
                          showCustomInput[item.courseId._id]
                            ? "custom"
                            : [1, 10, 50, 100].includes(item.seats)
                              ? item.seats
                              : "custom"
                        }
                        onChange={(e) =>
                          handleSelectChange(item.courseId._id, e.target.value)
                        }
                      >
                        <option value={1}>1 Seat</option>
                        <option value={10}>10 Seats</option>
                        <option value={50}>50 Seats</option>
                        <option value={100}>100 Seats</option>
                        <option value="custom">Custom</option>
                      </select>

                      {showCustomInput[item.courseId._id] && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={customSeats[item.courseId._id] || 1}
                            onChange={(e) =>
                              setCustomSeats({
                                ...customSeats,
                                [item.courseId._id]: Number(e.target.value),
                              })
                            }
                            className="border p-2 w-20 rounded"
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              applyCustomSeats(item.courseId._id)
                            }
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <span className="text-lg font-bold">
                      ₹{item.price}
                    </span>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        removeCourse(item.courseId._id)
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
        mt-6
      ">
              <span className="text-xl sm:text-2xl font-bold">
                Total: ₹{calculateTotal()}
              </span>

              <Link href="/company/checkout" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-lg px-6 py-2">
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

    </>
  );
}
