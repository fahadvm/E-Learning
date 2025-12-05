"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartCourses.length === 0 ? (
        <div className="text-center p-16 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">No courses in cart</h2>
          <Link href="/company/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartCourses.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.courseId.coverImage}
                  alt="thumbnail"
                  width={80}
                  height={60}
                  className="rounded"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {item.courseId.title}
                  </h2>
                  <h2 className="text-xl font-semibold">
                    ₹{item.courseId.price}
                  </h2>
                  <p className="text-gray-600 capitalize">
                    Access Type: {item.accessType}
                  </p>
                  <p className="text-gray-600 capitalize">
                    Seats: {item.seats}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.accessType === "seats" && (
                  <div className="flex items-center gap-2">
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

                    {/* Custom Seat Input with Apply Button */}
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
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              applyCustomSeats(item.courseId._id);
                            }
                          }}
                          className="border p-2 w-20 rounded"
                          placeholder="1-100"
                        />
                        <Button
                          size="sm"
                          onClick={() => applyCustomSeats(item.courseId._id)}
                          className="flex items-center gap-1"
                        >
                          <Check size={16} />
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <span className="text-xl font-bold">₹{item.price}</span>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCourse(item.courseId._id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <span className="text-2xl font-bold">Total: ₹{calculateTotal()}</span>
            <Link href="/company/checkout">
              <Button className="text-lg px-6 py-2">Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
