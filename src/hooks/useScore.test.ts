import { renderHook, act } from '@testing-library/react';
import useScore from './useScore';


describe('useScore', () => {
  it('should initialize with 0 stars and initial scores', () => {
    const { result } = renderHook(() => useScore());
    expect(result.current.stars).toBe(0);
    expect(result.current.scores.ones).toEqual(Array(6).fill(null));
  });

  it('should add a star', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.addStar();
    });
    expect(result.current.stars).toBe(1);
  });

  it('should remove a star', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.addStar();
    });
    act(() => {
      result.current.removeStar();
    });
    expect(result.current.stars).toBe(0);
  });

  it('should not remove a star if stars are 0', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.removeStar();
    });
    expect(result.current.stars).toBe(0);
  });

  it('should handle cell click and update score', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '1');
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('ones', 0);
    });
    expect(result.current.scores.ones[0]).toBe(1);
  });

  it('should validate straight row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '45'); // Invalid straight value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('straight', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Value for straight must be 0, 46, 56 or 66');
    expect(result.current.scores.straight[0]).toBe(null);

    window.prompt = jest.fn(() => '46'); // Valid straight value
    act(() => {
      result.current.handleCellClick('straight', 0);
    });
    expect(result.current.scores.straight[0]).toBe(46);
  });

  it('should validate trilling row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '19'); // Invalid trilling value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('trilling', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Invalid value for trilling');
    expect(result.current.scores.trilling[0]).toBe(null);

    window.prompt = jest.fn(() => '20'); // Valid trilling value
    act(() => {
      result.current.handleCellClick('trilling', 0);
    });
    expect(result.current.scores.trilling[0]).toBe(20);
  });

  it('should validate full row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '61'); // Invalid full value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('full', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Value for full must be between 0 and 60');
    expect(result.current.scores.full[0]).toBe(null);

    window.prompt = jest.fn(() => '60'); // Valid full value
    act(() => {
      result.current.handleCellClick('full', 0);
    });
    expect(result.current.scores.full[0]).toBe(60);
  });

  it('should validate poker row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '39'); // Invalid poker value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('poker', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Invalid value for poker');
    expect(result.current.scores.poker[0]).toBe(null);

    window.prompt = jest.fn(() => '40'); // Valid poker value
    act(() => {
      result.current.handleCellClick('poker', 0);
    });
    expect(result.current.scores.poker[0]).toBe(40);
  });

  it('should validate yamb row input', () => {
    const { result } = renderHook(() => useScore());
    window.prompt = jest.fn(() => '49'); // Invalid yamb value
    window.alert = jest.fn();

    act(() => {
      result.current.handleCellClick('yamb', 0);
    });
    expect(window.alert).toHaveBeenCalledWith('Invalid value for yamb');
    expect(result.current.scores.yamb[0]).toBe(null);

    window.prompt = jest.fn(() => '50'); // Valid yamb value
    act(() => {
      result.current.handleCellClick('yamb', 0);
    });
    expect(result.current.scores.yamb[0]).toBe(50);
  });

});
